# 🌐 Locale / i18n — Bahasa Rejang

Paket bahasa untuk developer — integrasikan Bahasa Rejang ke aplikasi Anda seperti halnya `id` (Indonesia) atau `en` (English).

## File yang Tersedia

| File | Bahasa | Kode Locale | Script |
|------|--------|-------------|--------|
| `en.json` | English | `en` | Latin |
| `id.json` | Bahasa Indonesia | `id` | Latin |
| `rej.json` | Bahasa Rejang | `rej` | Latin |
| `rej-Rjng.json` | Bahasa Rejang | `rej-Rjng` | Aksara Kaganga |

> Kode `rej` adalah kode resmi ISO 639-3 untuk Bahasa Rejang.  
> Kode `Rjng` adalah kode resmi ISO 15924 untuk aksara Rejang (Kaganga).

---

## Cara Pakai

### React / Next.js (react-i18next)

```bash
npm install react-i18next i18next
```

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en  from './locale/en.json';
import id  from './locale/id.json';
import rej from './locale/rej.json';

i18n.use(initReactI18next).init({
  resources: {
    en:  { translation: en  },
    id:  { translation: id  },
    rej: { translation: rej }
  },
  lng: 'rej', // set default ke Bahasa Rejang
  fallbackLng: 'id'
});

// Pakai di komponen:
// const { t } = useTranslation();
// t('common.save')  →  "simpen"
// t('nav.home')     →  "umeak"
// t('auth.login')   →  "masuk"
```

### Vue / Nuxt (vue-i18n)

```javascript
import { createI18n } from 'vue-i18n';
import rej from './locale/rej.json';
import id  from './locale/id.json';

const i18n = createI18n({
  locale: 'rej',
  fallbackLocale: 'id',
  messages: { rej, id }
});
```

### Flutter (ARB format)

Konversi JSON ke ARB:
```dart
// lib/l10n/app_rej.arb  (buat dari rej.json)
{
  "@@locale": "rej",
  "commonOk": "iyo",
  "commonSave": "simpen",
  "navHome": "umeak"
}
```

### Vanilla JavaScript

```html
<!-- Pastikan font Kaganga ter-load untuk rej-Rjng -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Rejang" rel="stylesheet">

<script>
  fetch('./locale/rej.json')
    .then(r => r.json())
    .then(lang => {
      document.getElementById('btn-save').textContent = lang.common.save; // "simpen"
      document.getElementById('title-home').textContent = lang.nav.home;  // "umeak"
    });
</script>
```

---

## Menampilkan Aksara Kaganga

Untuk `rej-Rjng.json`, pastikan font **Noto Sans Rejang** dimuat:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Rejang&display=swap" rel="stylesheet">

<style>
  .kaganga { font-family: 'Noto Sans Rejang', serif; }
</style>
```

---

## Struktur Key

```
common.*      → Kata umum (ok, batal, simpan, hapus, dll)
nav.*         → Navigasi (beranda, kembali, menu, profil)
auth.*        → Autentikasi (masuk, daftar, kata sandi)
form.*        → Pesan form & validasi
time.*        → Waktu (hari ini, kemarin, besok)
days.*        → Nama hari
```

---

## Kontribusi

Temukan terjemahan yang kurang tepat? Buka [GitHub Issues](https://github.com/hariyantodipayang/kamus-bahasa-rejang/issues) atau langsung Pull Request.

Yang masih dibutuhkan:
- [ ] Dialek Lebong (`rej-lebong.json`)
- [ ] Dialek Kepahiang (`rej-kepahiang.json`)
- [ ] Dialek Bengkulu Utara (`rej-bengkulu-utara.json`)
- [ ] Dialek Bengkulu Tengah (`rej-bengkulu-tengah.json`)
- [ ] Format ARB untuk Flutter
- [ ] Format XML untuk Android
- [ ] Format strings untuk iOS/Swift
