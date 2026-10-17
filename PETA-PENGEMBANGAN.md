# Peta Pengembangan TUMBUAH — Prototipe Interaktif

Dokumen ini membedakan fitur aktif, demonstrasi antarmuka, dan fitur yang masih membutuhkan implementasi atau validasi.

## Sudah ada pada aplikasi
- PWA dengan manifest, Service Worker, cache shell dan data lokal.
- Kamus kosakata, tampilan Kaganga, konverter dan kuis yang sudah ada pada kode dasar.
- Halaman latihan Trace sebagai prototipe, dengan penilaian yang masih berupa perkiraan dan perlu validasi ahli.
- Katalog budaya lokal dengan pencarian, filter, ringkasan, dan tautan ke beberapa rujukan awal. Kartu budaya tetap ditandai sesuai status sumbernya.
- Katalog audio interaktif; pemutaran rekaman penutur belum aktif. Kata dan prioritas rekaman dapat dikelola sebagai draf lokal saja.
- Jelajah Kontekstual/AR: akses kamera dan overlay manual dapat dicoba di perangkat yang mendukung; pengenalan marker, computer vision, pelacakan ruang, dan AR 3D otomatis belum diimplementasikan.
- Evaluasi belajar: soal contoh, skala SUS draf, penyimpanan lokal dan ekspor JSON. Instrumen belum divalidasi dan hasil bukan data penelitian.
- Formulir usulan konten budaya yang menyimpan draf lokal; belum mengirim ke server.

## Masih dalam tahap pengembangan
1. Rekaman audio penutur, metadata dialek dan izin distribusi offline.
2. Pengenalan marker otomatis, pelacakan objek, penempatan overlay ruang dan aset model 3D yang tervalidasi.
3. Alur kontribusi ke server dengan peninjauan editor, penutur dan pemilik pengetahuan budaya.
4. Validasi kurikulum, pola dan urutan goresan Trace, serta soal pre/post/retensi/SUS.
5. Sinkronisasi atau backup lintas perangkat; seluruh draf yang ada saat ini hanya di localStorage.

## Sumber awal katalog budaya
- Unicode Standard, Chapter 17 — Rejang: https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-17/
- Unicode Rejang names list: https://www.unicode.org/Public/18.0.0/charts/nameslist/a930/
- Studi Batik Kaganga melalui GARUDA: https://download.garuda.kemdikbud.go.id/article.php?article=1373557&title=STUDI+TENTANG+BATIK+KAGANGA+KABUPATEN+REJANG+LEBONG+PROVINSI+BENGKULU&val=1540
- Makna Simbolik Tari Kejei melalui GARUDA: https://download.garuda.kemdikbud.go.id/article.php?article=997122&title=MAKNA+SIMBOLIK+TARI+KEJEI+SUKU+REJANG&val=8856
- Warisan Budaya Takbenda Bekejai: https://budaya.data.kemdikbud.go.id/wbtb/objek/AA000411
- Leksikon rumah adat dan masakan tradisional: https://sawerigading.kemdikbud.go.id/index.php/sawerigading/article/view/740
- Publikasi KSDAE tentang Rafflesia: https://ksdae.menlhk.go.id/assets/publikasi/Rafflesia%20-%20Pesona%20Bunga%20Terbesar%20di%20Dunia.pdf

## Catatan privasi
- Data misi, hasil evaluasi, daftar prioritas audio, dan draf kontribusi hanya disimpan secara lokal pada perangkat yang digunakan.
- Tidak ada API/server backend untuk mengirim data pada paket ini.
- Hasil tes bersifat demonstrasi dan tidak boleh dilaporkan sebagai temuan penelitian tanpa instrumen dan prosedur yang tervalidasi.
