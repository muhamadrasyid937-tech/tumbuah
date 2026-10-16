# TUMBUAH — Bahasa Rejang & Aksara Kaganga

Platform pembelajaran web open source untuk belajar dan melestarikan **Bahasa Rejang** dan **Aksara Kaganga** dari Bengkulu — lengkap dengan **1.284 kata**, **5 dialek**, dan **aksara Kaganga** interaktif.

**Demo langsung:** [buka `index.html` di browser] | [GitHub Pages](https://muhamadrasyid937-tech.github.io/kamus-bahasa-rejang/)  
**Repositori:** [github.com/hariyantodipayang/kamus-bahasa-rejang](https://github.com/hariyantodipayang/kamus-bahasa-rejang)

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| 📚 **Kamus** | 1.284 kata Indonesia ↔ Rejang dari BERENDO, filter per dialek & kategori |
| 🔤 **Huruf Kaganga** | Tabel lengkap 23 konsonan + vokal + angka, tooltip Unicode |
| 🔄 **Konverter Teks** | Ketik Latin → tampil otomatis dalam aksara Kaganga |
| 🎯 **Kuis** | Latihan tebak huruf Kaganga & kosakata (Indonesia & Inggris) |

---

## Lima Dialek yang Didokumentasikan

- **Lebong** — Kabupaten Lebong
- **Rejang Lebong** — Kabupaten Rejang Lebong *(dialek referensi)*
- **Kepahiang** — Kabupaten Kepahiang
- **Bengkulu Utara** — Kabupaten Bengkulu Utara
- **Bengkulu Tengah** — Kabupaten Bengkulu Tengah

---

## Sumber Data

Data kosakata bersumber dari **[BERENDO](https://berendo.kemendikdasmen.go.id)** — platform kamus resmi Kemendikdasmen RI yang dikurasi oleh Balai Bahasa Bengkulu. Seluruh **1.284 entri Bahasa Rejang** telah diintegrasikan langsung ke dalam aplikasi, dilengkapi terjemahan Bahasa Inggris.

---

## Struktur File

```
kamus-bahasa-rejang/
├── index.html              ← Aplikasi TUMBUAH (PWA)
├── data/
│   ├── kosakata-berendo.json  ← 1.284 kata Rejang dari BERENDO
│   └── kaganga.json           ← Data lengkap huruf Kaganga (23 konsonan + vokal + angka)
├── locale/
│   ├── en.json             ← Terjemahan Inggris (referensi)
│   ├── id.json             ← Terjemahan Indonesia (referensi)
│   ├── rej.json            ← Bahasa Rejang (ISO 639-3: rej), aksara Latin
│   ├── rej-Rjng.json       ← Bahasa Rejang (ISO 15924: Rjng), aksara Kaganga
│   └── README.md           ← Panduan integrasi i18n untuk developer
├── package.json            ← NPM package (ekspor locale files)
├── README.md
└── LICENSE
```

---

## 🚀 Cara Pakai

### Buka Lokal
```bash
# Tidak perlu server! Cukup buka file:
# Windows: klik dua kali index.html
# Mac/Linux:
open index.html
```

### Host di GitHub Pages
1. Fork repositori ini
2. Buka **Settings → Pages**
3. Pilih branch `main`, folder `/root`
4. Kunjungi `https://username.github.io/kamus-bahasa-rejang`

### Embed di Website Lain
```html
<iframe src="https://hariyantodipayang.github.io/kamus-bahasa-rejang" 
  width="100%" height="600" frameborder="0"></iframe>
```

---

## 🌐 Untuk Developer — Locale i18n

Paket locale Bahasa Rejang tersedia untuk digunakan di aplikasi Anda:

```bash
# Salin folder locale/ ke proyek Anda, atau install via npm (segera hadir)
```

```javascript
// React / Next.js (react-i18next)
import rej from './locale/rej.json';
// t('common.save')  →  "simpen"
// t('nav.home')     →  "umeak"
// t('auth.login')   →  "masuk"
```

Lihat [locale/README.md](locale/README.md) untuk panduan lengkap (Vue, Flutter, Vanilla JS).

---

## 🤝 Cara Berkontribusi

Kami sangat menyambut kontribusi dari siapapun — terutama penutur asli Bahasa Rejang!

### Melaporkan Kesalahan atau Koreksi
Buka [GitHub Issues](https://github.com/hariyantodipayang/kamus-bahasa-rejang/issues) dan jelaskan:
- Kata atau huruf yang salah
- Koreksi yang benar (beserta dialeknya)
- Sumber referensi jika ada

### Menambah Terjemahan Inggris
Banyak entri BERENDO belum memiliki terjemahan Inggris. Kontribusi via Pull Request sangat dihargai.

### Ide Pengembangan
- [ ] Rekaman audio pengucapan kata
- [ ] Kalimat & frasa umum
- [ ] Cerita pendek dalam Bahasa Rejang
- [ ] Aplikasi mobile (Android/iOS)
- [ ] Mode offline (PWA)
- [ ] Locale per dialek (rej-lebong, rej-kepahiang, dst.)
- [ ] Format ARB untuk Flutter & XML untuk Android

---

## 📚 Referensi

- **BERENDO** — [berendo.kemendikdasmen.go.id](https://berendo.kemendikdasmen.go.id) — Kamus resmi Kemendikdasmen, Balai Bahasa Bengkulu
- Jaspan, M.A. (1964). *A Rejang-English dictionary*. ANU Press, Canberra.
- Walker, D.F. (1976). *A grammar of the Rejang language*. Pacific Linguistics.
- The Unicode Consortium. *The Unicode Standard* — Rejang Block (U+A930–U+A95F).
- Noto Sans Rejang Font — Google Fonts.

---

## 📜 Lisensi

- **Kode aplikasi:** [MIT License](LICENSE)
- **Data kosakata & konten:** [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Bebas digunakan, dimodifikasi, dan didistribusikan — dengan menyebut sumber.

---

## 👨‍💻 Developer

<table>
<tr>
<td align="center" width="160">
<img src="https://cdn.lynkid.my.id/profile/01-05-2026/1777639293606_8868403.webp" width="100" style="border-radius:50%"><br>
<strong>Hariyanto, S.Sos</strong><br>
<em>ASN Kepahiang · Developer · Crypto Creator · YouTuber</em>
</td>
<td>

*"Mengabdi dengan ilmu, bertumbuh lewat inovasi."*

Seorang Aparatur Sipil Negara Kabupaten Kepahiang yang percaya bahwa tugas negara dan semangat berinovasi bisa berjalan beriringan. Membangun proyek open source ini sebagai bentuk pelestarian budaya digital Bengkulu.

🏛️ **ASN** — Badan Keuangan Daerah Kabupaten Kepahiang  
💻 **Developer** — Aplikasi web, sistem informasi, AppSheet  
₿ **Crypto Creator** — Edukasi kripto & analisis pasar  
🎬 **YouTuber** — [@ardion_news](https://www.youtube.com/@ardion_news)

**Proyek lain:**  
[DIPAYANG](https://dipayang.idcrypt.xyz) · [IDCrypt](https://idcrypt.xyz) · [Kasir Kita](https://hariyantodipayang.github.io/kasir-kita/) · [SIPANDAI](https://kphinside.github.io/sipandai-app/)

🌐 [dipayang.idcrypt.xyz/profil](https://dipayang.idcrypt.xyz/profil) · 💬 [WhatsApp](https://wa.me/6285609326414) · ⭐ [GitHub](https://github.com/hariyantodipayang)

</td>
</tr>
</table>

---

## 🙏 Penghargaan

Terima kasih kepada seluruh penutur Bahasa Rejang yang telah menjaga warisan leluhur ini tetap hidup, dan kepada Balai Bahasa Bengkulu atas dokumentasi kosakata yang terkonfirmasi.

*Mo te' — ꤸꥋ ꤳꤰ*

---

<p align="center">
Dibuat dengan ❤️ untuk melestarikan warisan budaya Bengkulu<br>
<em>ꤰꤱꤲ · ꤳꤴꤵ · ꤶꤷꤸ</em><br><br>
<a href="https://dipayang.idcrypt.xyz/profil">👨‍💻 Hariyanto, S.Sos</a> · <a href="https://github.com/hariyantodipayang/kamus-bahasa-rejang">⭐ GitHub</a> · <a href="https://wa.me/6285609326414">💬 WhatsApp</a>
</p>
