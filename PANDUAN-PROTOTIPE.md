# TUMBUAH — Panduan Prototipe Interaktif

Paket ini memperluas UI mobile-first TUMBUAH tanpa mengganti alur kamus, konverter, Kaganga, kuis, atau Trace yang sudah ada.

## Berkas yang berubah / ditambahkan

- `index.html` — menambahkan tab Audio Penutur, Jelajah Kontekstual/AR, Evaluasi Belajar, dan katalog budaya interaktif; mempertahankan panel aplikasi yang sudah ada.
- `prototype.css` — stylesheet lokal untuk modul baru; tidak memakai framework atau library eksternal.
- `prototype.js` — interaksi untuk katalog budaya, draf kontribusi lokal, katalog audio, tampilan kamera dan overlay demo, misi, instrumen evaluasi, penyimpanan lokal, serta ekspor hasil JSON.
- `data/budaya.json` — delapan kartu informasi yang mempunyai status rujukan/peninjauan dan tautan sumber. Ringkasan tidak otomatis dianggap telah diverifikasi oleh komunitas.
- `sw.js` — cache version baru dan precache `prototype.css`, `prototype.js`, serta `data/budaya.json`.
- `PETA-PENGEMBANGAN.md` dan `README.md` — menjelaskan status aktual prototipe.

## Pemasangan di GitHub Pages

1. Buat salinan cadangan repositori sebelum mengganti file.
2. Unggah/ganti `index.html` dan `sw.js` di root repositori.
3. Tambahkan `prototype.css` dan `prototype.js` di root.
4. Tambahkan `data/budaya.json` ke folder `data/` yang sudah ada.
5. Pertahankan `styles.css`, `trace.html`, `manifest.json`, seluruh data lama, folder `locale/`, dan folder `icons/`.
6. Commit perubahan. Buka aplikasi saat online agar Service Worker menginstal cache v5, kemudian uji kembali.

## Modul dan batasannya

### Info Budaya
- Pencarian dan filter kategori berjalan lokal.
- Setiap kartu dapat dibuka dalam dialog yang berisi ringkasan dan sumber.
- Status sumber dipisahkan dari status verifikasi komunitas.
- Formulir usulan menyimpan draf di `localStorage` dan dapat diekspor; **draf belum dikirim ke server**.

### Audio Penutur
- Ada katalog kata dan daftar kebutuhan rekaman.
- Tombol audio menunjukkan keterangan status; tidak memainkan suara sintetis yang diklaim sebagai Bahasa Rejang.
- Prioritas rekaman hanya tersimpan lokal. Tidak ada unggahan audio atau server kontribusi.

### Jelajah Kontekstual / AR
- Tombol kamera meminta izin `getUserMedia`; kamera berfungsi jika browser, izin, perangkat, dan konteks HTTPS mendukung.
- Mode kartu demo bisa dicoba tanpa kamera dan tanpa internet setelah berkas tersimpan.
- Overlay kata dipilih secara manual dari daftar contoh. **Tidak ada pengenalan marker, computer vision, pelacakan ruang, atau penempatan model 3D otomatis** pada paket ini.
- Aksara overlay adalah pratinjau dari konverter aplikasi, bukan hasil validasi penutur.

### Evaluasi Belajar
- Berisi contoh prates, pascates, tes retensi, serta sepuluh butir SUS versi draf.
- Soal dan terjemahan kuesioner belum divalidasi sebagai instrumen penelitian.
- Hasil tersimpan pada `localStorage` perangkat. Tidak ada telemetri atau pengiriman data otomatis.
- Pengguna dapat mengekspor hasil JSON atau menghapus hasil lokal.

## Checklist pengujian sesudah diterbitkan

- [ ] Beranda, Kamus, Kaganga, Konverter, Kuis, Trace tetap bekerja.
- [ ] Info Budaya tampil dan kartu detail/sumber dapat dibuka.
- [ ] Pencarian/filter budaya bekerja serta draf kontribusi tersimpan lokal.
- [ ] Katalog audio tampil; tombol tidak mengeluarkan audio palsu dan status tahap pengembangan terbaca.
- [ ] Mode kartu demo dapat digunakan offline.
- [ ] Kamera bisa diminta izinnya saat HTTPS; jika gagal, mode demo tetap tersedia.
- [ ] Evaluasi menghitung skor, menyimpan lokal, mengekspor JSON, dan menghapus data.
- [ ] Setelah cache v5 terinstal, tab tambahan tetap dapat dibuka dalam mode pesawat.
- [ ] Uji layar HP dan desktop; periksa navigasi bawah dan panel menu.

## Privasi dan kejujuran prototipe

Semua data misi, hasil evaluasi, draf budaya, dan prioritas audio disimpan pada perangkat yang digunakan. Draf tidak disinkronkan. Jangan menyebut skor contoh sebagai hasil penelitian dan jangan menyebut overlay manual sebagai AR otomatis.
