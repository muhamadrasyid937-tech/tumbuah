/**
 * BERENDO Extractor Script v2
 * ============================
 * Tempel kode ini di Console browser (F12) saat berada di halaman
 * https://berendo.kemendikdasmen.go.id/pencarian
 *
 * Cara pakai:
 * 1. Buka https://berendo.kemendikdasmen.go.id/pencarian di browser
 * 2. Tekan F12 → pilih tab Console
 * 3. Ketik "allow pasting" → Enter (peringatan browser normal)
 * 4. Salin seluruh isi BAGIAN SCRIPT di bawah (mulai dari tanda kurung)
 * 5. Tempel dan tekan Enter — tunggu hingga selesai (~10-15 menit)
 * 6. File berendo-export.json akan terunduh otomatis
 * 7. Import file tersebut di tab BERENDO pada aplikasi Kamus Bahasa Rejang
 *
 * Strategi:
 * - Scrape /pencarian/hasil/{aa..zz} untuk semua 676 kombinasi 2 huruf
 * - Parse HTML dengan DOMParser — tidak perlu API JSON
 * - Deduplikasi berdasarkan ID entri
 * - Tangani pagination jika ada
 */

(async () => {
  // ── Status overlay ────────────────────────────────────────────
  const ui = document.createElement('div');
  ui.style.cssText = `
    position:fixed;top:10px;right:10px;background:#003580;color:#fff;
    padding:14px 18px;border-radius:12px;font-family:monospace;font-size:12px;
    z-index:99999;min-width:300px;box-shadow:0 4px 24px rgba(0,0,0,0.4);
    line-height:1.6;`;
  ui.innerHTML = '⏳ Memulai ekstraksi BERENDO...';
  document.body.appendChild(ui);
  const log = msg => { ui.innerHTML = msg; console.log('[BERENDO]', msg.replace(/<[^>]+>/g,'')); };

  // ── Parser kartu kata ─────────────────────────────────────────
  const hasil = new Map(); // id → data, untuk deduplication

  function parseHalaman(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('.word-card-premium').forEach(card => {
      // Ambil ID dari atribut id="entry-card-{n}"
      const idMatch = (card.id || '').match(/entry-card-(\d+)/);
      if (!idMatch) return;
      const id = idMatch[1];
      if (hasil.has(id)) return; // sudah ada, skip

      const kata     = card.querySelector('.word-title')?.textContent.trim() || '';
      const suku     = card.querySelector('.word-syllable')?.textContent.trim() || kata;
      // Ambil SEMUA badge bahasa (kadang ada lebih dari satu)
      const bahasaArr = [...card.querySelectorAll('.badge-bahasa')].map(b => b.textContent.trim());
      const bahasa   = [...new Set(bahasaArr)].join(', ') || '';
      const kelas    = card.querySelector('.badge-kelas')?.textContent.trim() || '';
      const maknaArr = [...card.querySelectorAll('.meaning-text')].map(m => m.textContent.trim()).filter(Boolean);

      hasil.set(id, {
        id,
        kata,
        suku_kata: suku !== kata ? suku : undefined,
        bahasa,        // "Rejang" / "Enggano" / "Bengkulu"
        kelas,         // "n", "v", "adj", dll
        makna: maknaArr.join(' | '),
        indonesia: maknaArr[0] || '',
        sumber: 'BERENDO'
      });
    });

    // Cek apakah ada halaman berikutnya
    const nextLink = doc.querySelector('a[rel="next"], .pagination .next:not(.disabled) a, [aria-label="Next"]');
    return nextLink?.href || null;
  }

  // ── Fungsi fetch dengan retry ─────────────────────────────────
  async function fetchHalaman(url, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const r = await fetch(url);
        if (!r.ok) return null;
        return await r.text();
      } catch (e) {
        if (i === retries) return null;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  // ── Main loop: semua kombinasi 2 huruf + 1 huruf ──────────────
  const abjad = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const queries = [];

  // Tambah single letters dulu
  abjad.forEach(a => queries.push(a));
  // Lalu semua 2-letter combos
  abjad.forEach(a => abjad.forEach(b => queries.push(a + b)));

  const total = queries.length;
  let done = 0;

  for (const q of queries) {
    done++;
    log(`🔍 Mencari "<b>${q}</b>" (${done}/${total}) — <b>${hasil.size}</b> entri terkumpul`);

    let url = `/pencarian/hasil/${encodeURIComponent(q)}`;
    let halaman = 1;

    while (url) {
      const html = await fetchHalaman(url);
      if (!html) break;

      const nextUrl = parseHalaman(html);

      // Hanya ikuti pagination untuk query ini
      if (nextUrl && nextUrl.includes('/pencarian/hasil/')) {
        url = nextUrl;
        halaman++;
        await new Promise(r => setTimeout(r, 200));
      } else {
        break;
      }
    }

    await new Promise(r => setTimeout(r, 220));
  }

  // ── Bersihkan & download ──────────────────────────────────────
  const data = [...hasil.values()].sort((a, b) => Number(a.id) - Number(b.id));

  // Hapus field undefined
  const bersih = data.map(item => {
    const obj = {};
    Object.entries(item).forEach(([k, v]) => { if (v !== undefined && v !== '') obj[k] = v; });
    return obj;
  });

  log(`✅ <b>Selesai!</b> ${bersih.length} entri unik dari ${total} query — mengunduh JSON...`);

  const blob = new Blob([JSON.stringify(bersih, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'berendo-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => ui.remove(), 6000);
  console.log('[BERENDO] Data lengkap:', bersih);
})();
