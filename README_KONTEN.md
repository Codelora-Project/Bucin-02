# 📖 Petunjuk Mengganti Konten Personal Website Romantis

Website ini dirancang khusus dengan **satu file konfigurasi terpusat** agar Anda bisa mengganti seluruh konten personal (nama, teks, foto, musik, surat cinta) dengan sangat mudah tanpa perlu mengubah kode HTML, CSS, atau JavaScript.

---

## 📍 Lokasi File Config

File konfigurasi utama berada di:
`src/config/content.js`

---

## 📝 Cara Mengganti Teks & Nama

Buka file `src/config/content.js` dengan editor teks (misalnya VS Code / Notepad).

1. **Nama & Pesan Welcome**:
   Cari bagian `welcomeConfig` di baris atas file, ubah teks di dalam tanda petik `"..."`.
2. **Surat Cinta**:
   Cari bagian `loveLetter`, Anda dapat menambahkan atau merubah paragraf di dalam array `paragraphs: [...]`.
3. **Alasan Mencintai**:
   Cari bagian `alasanCinta`, ganti `title` dan `description` pada tiap objek kartu `01` sampai `06`.
4. **Pesan Penutup**:
   Cari bagian `pesanPenutup`, ubah teks `title` dan `message`.

---

## 🖼️ Cara Mengganti Foto Galeri

1. Masukkan foto-foto Anda ke dalam folder:
   `public/photos/` (Buat folder `photos` jika belum ada).
2. Di file `src/config/content.js`, cari bagian `fotoGallery`.
3. Ubah `url` pada tiap foto menjadi path lokal:
   ```javascript
   url: "/photos/foto-1.jpg",
   title: "Momen Pertama Di Pantai",
   caption: "Waktu kita senja bareng...",
   date: "14 Februari 2025"
   ```

---

## 🎵 Cara Mengganti Musik Latar

1. Masukkan file lagu berformat `.mp3` ke dalam folder:
   `public/audio/` (Buat folder `audio` jika belum ada). Contoh nama file: `lagu-favorit.mp3`.
2. Di file `src/config/content.js`, cari bagian `musikLatar`:
   ```javascript
   musikLatar: {
     title: "Until I Found You",
     artist: "Stephen Sanchez",
     audioUrl: "/audio/lagu-favorit.mp3"
   }
   ```

---

## 🚀 Cara Preview Hasil Perubahan Secara Lokal

Buka terminal di folder project, lalu jalankan:
```bash
npm run dev
```
Buka alamat yang tampil (contoh: `http://localhost:5173`) di browser Anda!
