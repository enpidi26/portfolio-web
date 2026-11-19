# Minimalist Portfolio (Monochrome & Zero-Install)

Website portofolio sederhana, elegan, dan bebas dari *gimmick* atau *AI slop*. Dirancang dengan fokus pada tipografi yang tenang, hierarki yang jelas, dan palet hitam-putih.

---

## 🚀 Cara Menjalankan

Website ini **100% Zero-Install** (tanpa perlu Node.js, npm, atau build tools).
Cukup klik dua kali file **`index.html`** di komputer Anda, dan website langsung terbuka di browser favorit Anda.

> Catatan: sebagian browser membatasi font kustom saat halaman dibuka lewat `file://`.
> Untuk tampilan yang persis seperti produksi, jalankan server lokal:
> `python -m http.server 8090`, lalu buka `http://localhost:8090`.

---

## 📁 Struktur Proyek

```text
.
├── index.html                  Halaman + seluruh konten statis
├── assets/
│   ├── css/
│   │   ├── main.css            Gaya kustom: tema, kursor, animasi
│   │   ├── fonts.css           @font-face font self-hosted
│   │   └── tailwind.css        Tailwind hasil compile (jangan diedit manual)
│   ├── js/
│   │   └── main.js             Data proyek, filter, tema, kursor tinta
│   ├── fonts/                  Inter & JetBrains Mono (subset latin)
│   └── icons/                  Favicon (ico, 32px, 512px)
├── docs/
│   ├── README.md               Dokumentasi rinci + screenshot
│   ├── thumbnail.png           Gambar preview
│   ├── screenshots/            Screenshot desktop & mobile
│   └── licenses/               Lisensi font (SIL OFL 1.1)
├── _headers                    Security + cache headers (Cloudflare Pages)
├── tailwind.config.js          Konfigurasi compile Tailwind
├── tailwind.input.css          Entry point Tailwind
├── CHANGELOG.md
└── LICENSE
```

---

## ✏️ Cara Mengedit Konten

1. **Nama, Bio, dan Kontak**:
   Buka `index.html`, ubah:
   - Nama: `Navid Athallah`
   - Bio / deskripsi diri
   - Riwayat kerja di bagian `Experience`
   - Email: `navidvkt@gmail.com`
   - Tautan sosial (GitHub, X, LinkedIn) di bagian `Contact`

2. **Daftar Proyek / Karya**:
   Buka `assets/js/main.js`, edit atau tambahkan karya Anda di array `PROJECTS`:
   ```javascript
   {
     id: "nama-proyek",
     title: "Nama Proyek",
     category: "projects", // atau "experiments"
     year: "2026",
     description: "Deskripsi singkat dan jujur tentang apa yang dibuat.",
     tags: ["Figma", "Tailwind", "TypeScript"],
     link: "https://tautan-proyek.com",
     previewHint: "Web Application • 1440px viewport"
   }
   ```

3. **Menambah class Tailwind baru**:
   `assets/css/tailwind.css` sudah berisi semua utility yang dipakai saat ini. Kalau Anda
   menambahkan class Tailwind baru di `index.html`/`assets/js/main.js`, regenerate sekali
   (butuh koneksi internet, tidak meng-install apa pun secara permanen):
   ```bash
   npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o assets/css/tailwind.css --minify
   ```

4. **Mengganti font**: taruh file `.woff2` di `assets/fonts/`, perbarui
   `assets/css/fonts.css`, lalu sesuaikan `<link rel="preload">` di `index.html`.

---

## 🌐 Deploy Gratis

Karena merupakan static website murni:
- **GitHub Pages**: Buat repository GitHub, upload file-file ini, lalu nyalakan Pages di *Settings > Pages*.
- **Vercel / Netlify**: Cukup drag-and-drop folder ini ke dashboard Vercel/Netlify.
- **Cloudflare Pages**: `_headers` otomatis dipakai untuk CSP, HSTS, dan cache font/ikon.

---

## 📖 Dokumentasi

Penjelasan fitur, screenshot, dan catatan teknis ada di [`docs/README.md`](./docs/README.md).
Riwayat perubahan ada di [`CHANGELOG.md`](./CHANGELOG.md).

---

## Lisensi & penggunaan

Repositori ini **bukan open source**. Seluruh kode dan konten dilindungi hak cipta (© 2026 Navid Athallah) dan dipublikasikan hanya untuk dilihat serta dievaluasi — misalnya untuk review portofolio, rekrutmen, atau laporan akademik.

Tidak ada izin untuk menyalin, memodifikasi, menyebarkan, atau memakai ulang karya ini, baik sebagian maupun seluruhnya, tanpa izin tertulis. Detailnya ada di [LICENSE](./LICENSE).
