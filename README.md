````markdown
# TikTok & Instagram Media Downloader

Repo ini berisi sebuah aplikasi berbasis **React** + **Tailwind CSS** dengan tema **neumorphism** (light & dark mode) yang memungkinkan pengguna untuk mengunduh media (video/GIF/gambar) dari TikTok maupun Instagram secara langsung tanpa watermark.

## Fitur Utama

- 🎥 **Download TikTok**

  - Video TikTok (tanpa watermark, format `.mp4`)
  - Gambar/slides/TikTok Photo Mode (format `.jpg`/`.jpeg`)

- 📸 **Download Instagram**
  - Reel (hanya unduh video `.mp4`)
  - post gambar (hanya unduh thumbnail `.jpg`)
- 🌗 **Dark Mode & Light Mode**

  - Toggle antara mode terang atau gelap dengan satu klik.

- ✂️ **Copy & Paste URL**

  - Tombol “Paste” membaca clipboard sehingga pengguna cukup menyalin tautan di aplikasi TikTok/Instagram lalu klik “Paste”.

- 🔄 **Responsive UI**

  - Tampilan konsisten di berbagai ukuran layar (mobile/tablet/desktop).

- ✅ **Validasi Link Otomatis**

  - Tombol “Download” otomatis aktif hanya jika URL valid (mengandung `tiktok.com` atau `instagram.com`/`ig.com`).

- ⚙️ **Neumorphism Design**
  - Setiap elemen antarmuka menggunakan efek shadow khas neumorphism, baik di light maupun dark mode.

---

---

## Prasyarat

Sebelum menjalankan project ini secara lokal, pastikan sudah terinstall:

- Node.js (v14+ direkomendasikan)
- npm atau Yarn
- Akun GitHub (jika ingin hosting di GitHub Pages)

---

## Instalasi (Setup Lokal)

1. **Clone repo ini**
   ```bash
   git clone https://github.com/wrdnika/tiktok-instagram-media-downloader.git
   cd tiktok-instagram-media-downloader
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   # atau kalau menggunakan Yarn:
   yarn install
   ```

3. **Buat file `.env` di root folder**
   Contoh isi `.env` (tanpa tanda kutip):

   ```
   VITE_TIKTOK_API=
   VITE_INSTAGRAM_API=
   ```

   - `VITE_TIKTOK_API` → endpoint API untuk mendownload media TikTok

   - `VITE_INSTAGRAM_API` → endpoint API untuk mendownload media Instagram

4. **Jalankan server development**

   ```bash
   npm run dev
   # atau dengan Yarn:
   # yarn dev
   ```

   Setelah berhasil, buka `http://localhost:5173` (atau port yang tertera di console) menggunakan browser.

---

## Konfigurasi Tambahan

- **Tailwind CSS**
  Konfigurasi shadow (neumorphism) di `tailwind.config.js`:

  ```js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        boxShadow: {
          neo: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
          "neo-inset":
            "inset 4px 4px 10px #d1d9e6, inset -4px -4px 10px #ffffff",
          "neo-dark": "8px 8px 16px #121212, -8px -8px 16px #2a2a2a",
          "neo-inset-dark":
            "inset 4px 4px 10px #121212, inset -4px -4px 10px #2a2a2a",
        },
      },
    },
    plugins: [],
  };
  ```

- **React Icons**
  Digunakan `react-icons/fa` untuk ikon:

  - `FaPaste`, `FaDownload`, `FaTiktok`, `FaInstagram`, `FaMoon`, `FaSun`, `FaCheckCircle`.

---

## Skrip NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- `npm run dev` → Jalankan mode development di `localhost:5173`
- `npm run build` → Membuat folder `dist/` untuk deploy
- `npm run preview` → Menjalankan server statis hasil build (cek di `http://localhost:4173`)

---

## Cara Deploy

1. Jalankan `npm run build` untuk menghasilkan folder `dist/`.
2. Hosting folder `dist/` ke layanan statis (GitHub Pages, Netlify, Vercel, dsb.).

   - Contoh di GitHub Pages:

     - Buat branch `gh-pages`.
     - Atur `dist/` sebagai source `gh-pages`.
     - Pastikan base URL pada `vite.config.js` (jika diperlukan) mengarah ke `${GITHUB_USERNAME}.github.io/${REPO_NAME}/`.

---

## Lisensi

Licensi MIT © \[Nama Anda atau Organisasi]
Silakan cek [LICENSE](./LICENSE) untuk detail.

---

```

```
