# 📖 Panduan Mengubah & Mengisi Konten Personal Website

Website ini dirancang khusus dengan **satu file konfigurasi terpusat** agar Anda dapat mengganti seluruh isi konten personal (PIN rahasia, nama pasangan, foto-foto memori, surat cinta, alasan cinta, catatan botol rahasia, hingga playlist musik) dengan sangat mudah tanpa perlu mengubah kode HTML, CSS, atau JavaScript.

---

## 📍 Lokasi File Konfigurasi Utama

Seluruh data personal diatur di dalam file:
`src/config/content.js`

---

## 🔑 1. Cara Mengganti PIN Kode Rahasia (Lock Screen)

Buka file `src/config/content.js`, cari bagian `pinGateConfig`:

```javascript
pinGateConfig: {
  pinCode: "2628", // 👈 Ganti 4 digit PIN rahasia Anda di sini
  title: "For You, My Love",
  hint: "Hint: Special date (Default PIN: 2628)" // 👈 Petunjuk PIN
}
```

---

## 💖 2. Cara Mengganti Nama & Pesan Utama (Hero Banner)

Cari bagian `heroConfig`:

```javascript
heroConfig: {
  subtitle: "a love letter in bloom",
  title: "For You, My Everything", // 👈 Judul Utama
  message: "Every petal holds a whisper of how much you mean to me.",
  daysTogetherText: "1,259 days with you", // 👈 Hitungan Hari Bersama (misal: "365 days with you")
  scrollHint: "Scroll down to explore your surprise"
}
```

---

## 🖼️ 3. Cara Mengganti Foto Galeri Memori

1. **Simpan Foto Anda**:
   Masukkan file foto Anda ke dalam folder: `public/photos/` (buat folder `photos` jika belum ada).  
   *Contoh nama file:* `foto-1.jpg`, `foto-2.jpg`.

2. **Update Konfigurasi `fotoGallery`**:
   Ubah `url`, `title`, dan `caption` pada tiap objek foto:

```javascript
fotoGallery: [
  {
    id: 1,
    url: "/photos/foto-1.jpg", // 👈 Path ke foto Anda
    title: "Kencan Pertama", // 👈 Judul Momen
    caption: "Waktu kita ngopi bareng pertama kali...", // 👈 Cerita Singkat
    date: "14 Februari 2025" // 👈 Tanggal
  },
  {
    id: 2,
    url: "/photos/foto-2.jpg",
    title: "Jalan-Jalan Ke Pantai",
    caption: "Senja indah bareng kamu...",
    date: "A Sunny Day"
  }
]
```

---

## 💌 4. Cara Mengisi Surat Cinta (Love Letter)

Cari bagian `loveLetter`:

```javascript
loveLetter: {
  title: "A Letter For You",
  subtitle: "On Your Birthday",
  salutation: "Dearest [Nama Pasangan],", // 👈 Panggilan Sayang / Nama Pasangan
  paragraphs: [
    "Selamat ulang tahun! Aku ingin membuatkan sesuatu yang spesial untukmu...", // 👈 Paragraf 1
    "Setiap momen bersamamu selalu terasa hangat dan menyenangkan...", // 👈 Paragraf 2
    "Terima kasih sudah selalu ada dan membawa banyak kebahagiaan di hidupku..." // 👈 Paragraf 3
  ],
  closing: "Dengan penuh cinta,",
  signature: "[Nama Anda]" // 👈 Nama Pengirim / Tanda Tangan
}
```

---

## 🌹 5. Cara Mengisi "Alasan Aku Mencintaimu" & Catatan Botol Rahasia

- **Kartu Alasan (`alasanCinta`)**:
  ```javascript
  alasanCinta: [
    {
      id: 1,
      number: "01",
      title: "Senyumanmu", // 👈 Judul Alasan
      description: "Senyummu selalu berhasil mencerahkan hari-hariku yang sibuk." // 👈 Penjelasan
    },
    ...
  ]
  ```

- **Catatan Botol Rahasia (`loveJarNotes`)**:
  Teks ucapan manis yang akan keluar secara acak saat tombol *"Shake the Jar"* diklik:
  ```javascript
  loveJarNotes: [
    "Suara tawamu adalah suara favoritku di dunia.",
    "Terima kasih sudah selalu menjadi tempat amanku.",
    "Aku bangga banget sama kamu!"
  ]
  ```

---

## 🎵 6. Cara Mengganti Musik / Lagu Latar Playlist

1. **Simpan Lagu MP3**:
   Masukkan file lagu berformat `.mp3` Anda ke folder `public/songs/` (misal: `lagu-kita.mp3`).

2. **Update Konfigurasi Playlist (`playlistConfig`)**:

```javascript
playlistConfig: [
  {
    id: 1,
    title: "Shape of My Heart",
    artist: "Sting",
    audioUrl: "/songs/shape of my heart.mp3" // 👈 Path ke file MP3 lokal Anda
  },
  {
    id: 2,
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    audioUrl: "/songs/lagu-kita.mp3"
  }
]
```

---

## 🎁 7. Cara Mengubah Pesan Penutup & Tombol Peluk

Cari bagian `pesanPenutup`:

```javascript
pesanPenutup: {
  title: "Happy Birthday, [Nama Pasangan]!",
  message: "Semoga hari ini dan hari-hari seterusnya selalu membawakan kebahagiaan untukmu.",
  subtext: "Tekan tombol di bawah untuk kirim pelukan hangat!",
  tombolPelukText: "Kirim Pelukan & Cinta"
}
```

---

## 🚀 8. Cara Preview Hasil Perubahan

Buka terminal di folder project, lalu jalankan:

```bash
npm run dev
```

Buka alamat lokal yang tampil (contoh: `http://localhost:5173`) di browser Anda! Setiap kali Anda menyimpan file `src/config/content.js`, browser akan otomatis memperbarui tampilannya secara *live*.
