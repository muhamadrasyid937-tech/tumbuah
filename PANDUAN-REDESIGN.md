# TUMBUAH UI/UX Refresh — Paket pembaruan

Paket ini memperbarui identitas visual aplikasi menjadi TUMBUAH dan mengganti ikon fungsional berbasis emoji/karakter dekoratif dengan SVG inline yang tersimpan di halaman.

## Perubahan
- Branding TUMBUAH pada header, judul halaman, footer, dan manifest PWA.
- Sistem warna konsisten: marun, krem, emas lembut, dan hijau sage.
- Ikon SVG lokal dan themeable untuk navigasi, kategori kamus, tombol, status kuis, serta halaman Trace.
- Beranda dan kartu fitur dirapikan; Rafflesia dibuat lebih kecil sebagai aksen, bukan elemen yang mendominasi.
- Tab Tentang disusun ulang menjadi kartu informasi dan referensi.
- Aset ikon PWA disesuaikan dengan identitas warna baru.
- Cache Service Worker dinaikkan ke `kamus-rejang-v5-tumbuah-ui`; scope dan URL project tetap `/kamus-bahasa-rejang/`.
- Tidak ada library UI pihak ketiga atau permintaan jaringan baru yang ditambahkan.

## Cara memasang
Unggah/replace `index.html`, `styles.css`, `trace.html`, `manifest.json`, `sw.js`, `README.md`, `package.json`, dan isi `icons/` ke root repositori. Pertahankan folder `data/` dan `locale/`. Commit semua perubahan dalam satu commit.

## Uji setelah deploy
1. Buka situs online dan cek semua tab, pencarian, filter kategori, konverter, kuis, serta Aksara Trace.
2. Lakukan hard refresh (`Ctrl+Shift+R`).
3. Tutup dan buka ulang PWA terpasang untuk memicu Service Worker baru.
4. Aktifkan mode pesawat dan uji kembali fitur utama.

Catatan font: aksara Rejang menggunakan font yang tersedia di perangkat dengan Noto Sans Rejang sebagai pilihan bila tersedia. Font web pihak ketiga bukan bagian dari app shell offline; jika perangkat tidak punya font aksara, tampilan glyph perlu diuji pada perangkat target.
