# PRD: [Nama Website Romantis — placeholder]

**Status:** Draft
**Tanggal:** 26 Juli 2026
**Versi:** 1.0

## 1. Ringkasan (Overview)

Website ini adalah kejutan personal berupa single-page website romantis yang dibuat untuk merayakan ulang tahun pasangan. Website akan berisi kumpulan kenangan, pesan cinta, dan momen interaktif yang disusun dengan nuansa mewah dan "dalam" (deep purple + rose gold), dibuka lewat halaman welcome bertema sebelum masuk ke konten utama. Tujuannya murni emosional: membuat pasangan merasa dicintai dan terkesan dengan usaha personal di baliknya — bukan produk komersial, dan tidak akan dipublikasikan atau digunakan orang lain.

## 2. Latar Belakang & Masalah (Problem Statement)

- Pemberi ingin memberi kejutan ulang tahun yang personal dan berkesan untuk pasangannya, lebih dari sekadar ucapan biasa (chat, kado fisik, dsb).
- Ucapan/kado konvensional sering terasa generik; website personal dengan konten khusus untuk pasangan terasa lebih niat dan sulit dilupakan.
- Tidak ada deadline ketat, tapi nilai kejutannya bergantung pada eksekusi visual dan emosional yang matang — bukan sekadar halaman teks biasa.

## 3. Tujuan & Metrik Keberhasilan (Goals & Success Metrics)

**Tujuan:**
- Membuat pasangan merasa dicintai, dihargai, dan terkesan saat membuka website ini.
- Menyampaikan pesan personal (love letter, alasan mencintai) dengan cara yang lebih berkesan dibanding media konvensional.
- Menghadirkan pengalaman "reveal" yang terasa mewah lewat halaman welcome beranimasi sebelum masuk ke konten utama.

**Metrik keberhasilan (kualitatif, karena ini gift personal bukan produk bisnis):**
- Pasangan membuka dan menjelajahi seluruh section utama (galeri, love letter, alasan mencintaimu, musik, penutup).
- Pasangan menunjukkan reaksi emosional positif (terharu/senang) saat pertama kali melihat, terutama di momen transisi welcome page.
- Website terasa personal dan "niat", bukan template generik.

**Non-goals:**
- Bukan website publik/portofolio — tidak perlu SEO, tidak perlu dibagikan ke banyak orang.
- Bukan platform dengan akun/login/multi-user.

## 4. Target User / Persona

**Persona utama: Pasangan (penerima kejutan)**
- Kebutuhan & motivasi: merasa dicintai dan diperhatikan di hari ulang tahunnya.
- Pain point yang relevan: ucapan ulang tahun konvensional terasa biasa saja; butuh sesuatu yang terasa lebih personal dan berkesan.
- Konteks pemakaian: kemungkinan besar diakses dari HP, dibuka dalam momen personal/santai (bukan terburu-buru).

**Persona sekunder: Pemberi (kamu)**
- Kebutuhan: alat untuk membangun website ini dengan cepat lewat AI coding agent, tanpa perlu ngoding manual.
- Pain point: ingin hasil visual terasa mewah dan romantis, bukan terlihat seperti template AI generik.

## 5. User Stories

- Sebagai pasangan, saya ingin disambut dengan halaman welcome yang elegan sebelum masuk ke konten utama, supaya momen "pembukaan kado" terasa spesial dan penuh antisipasi.
- Sebagai pasangan, saya ingin melihat galeri foto kenangan kami, supaya saya bisa bernostalgia dengan momen-momen berharga.
- Sebagai pasangan, saya ingin membaca love letter personal, supaya saya merasakan langsung ketulusan perasaan pasangan saya.
- Sebagai pasangan, saya ingin melihat daftar alasan kenapa saya dicintai secara interaktif, supaya prosesnya terasa seperti membuka kejutan kecil satu per satu.
- Sebagai pasangan, saya ingin mendengar lagu favorit kami diputar otomatis, supaya suasana emosionalnya lebih terasa.
- Sebagai pasangan, saya ingin diakhiri dengan penutup/countdown spesial, supaya pengalamannya terasa lengkap dan berkesan sampai akhir.

## 6. Core Features (per Fase)

### Fase 1 (Wajib)

- **Halaman Welcome / Gate** `[high]` — halaman pembuka sebelum masuk ke konten utama, harus diklik untuk masuk, dengan animasi transisi mewah.
  - **Tombol/elemen "buka kejutan"** — elemen interaktif (misal amplop, pintu, atau tombol bertema) yang harus disentuh/diklik untuk melanjutkan.
  - **Animasi transisi masuk** — efek visual mewah (fade, partikel, reveal) saat berpindah dari welcome page ke halaman utama, dirancang agar terasa seperti "pembukaan kado".
  - **Pesan singkat pembuka** — satu kalimat/judul personal yang muncul di halaman welcome sebagai pemantik rasa penasaran.

- **Galeri foto/kenangan** `[high]` — menampilkan koleksi foto momen berdua.
  - **Grid/carousel foto** — layout galeri yang bisa di-scroll atau di-swipe.
  - **Animasi saat foto muncul** — efek fade-in/scroll-reveal supaya tidak terasa statis.

- **Love letter / pesan personal** `[high]` — bagian teks panjang berisi surat cinta.
  - **Tipografi & layout khusus** — ditampilkan seperti surat, bukan paragraf biasa (elegan, mudah dibaca).
  - **Animasi reveal teks** — teks muncul bertahap (misal per paragraf) saat di-scroll, bukan langsung semua muncul.

- **Alasan mencintaimu (list interaktif)** `[high]` — daftar alasan mencintai pasangan, ditampilkan satu per satu secara interaktif.
  - **Klik untuk membuka** — tiap alasan tersembunyi di balik kartu/elemen yang harus diklik untuk terbuka.
  - **Animasi saat terbuka** — efek transisi (flip card, fade, dsb) saat alasan terungkap.

- **Musik latar otomatis** `[high]` — lagu favorit berdua diputar sebagai background.
  - **Auto-play saat masuk konten utama** (dengan tombol mute/pause yang tetap terlihat, karena banyak browser membatasi autoplay dengan suara — perlu fallback tombol "putar musik" kalau autoplay diblokir).
  - **Kontrol volume sederhana** — tombol mute/unmute yang mudah dijangkau.

- **Countdown/penutup spesial** `[high]` — bagian penutup di akhir halaman.
  - **Pesan penutup personal** — kalimat penutup yang menguatkan kesan setelah menjelajah semua section.
  - **Elemen visual penutup** — animasi akhir (misal bintang jatuh, konfeti lembut, atau efek cahaya) sebagai penutup pengalaman.

### Fase 2 (Menyusul, opsional)

- **Timeline perjalanan hubungan** `[medium]` — linimasa momen-momen penting dalam hubungan.
  - **Format scroll vertikal/horizontal** — tiap momen ditampilkan sebagai titik di linimasa dengan tanggal & deskripsi singkat.
  - **Animasi scroll-triggered** — tiap titik linimasa muncul dengan animasi saat di-scroll ke posisinya.

### Non-Functional Requirements

- **Performa**: karena banyak animasi, pastikan animasi tetap ringan (gunakan CSS transition/transform, hindari animasi berat yang bikin lag terutama di HP).
- **Kompatibilitas**: harus tampil baik di browser mobile (karena kemungkinan besar dibuka dari HP pasangan).
- **Privasi**: website ini berisi konten sangat personal — tidak boleh ter-index oleh search engine (tambahkan `robots.txt` disallow / meta noindex), dan idealnya tidak mudah ditemukan orang lain (bukan didaftarkan ke direktori publik).

## 7. Desain & UX

- **Tema & Gaya Visual**: nuansa "malam berbintang romantis" — gradasi ungu tua (deep purple) ke hitam sebagai warna dasar, dengan aksen rose gold untuk teks penting, border, dan elemen dekoratif. Mood keseluruhan: mewah, misterius, romantis — bukan playful/pastel.
- **Komponen visual kunci**: efek partikel lembut (bintang berkelip atau kunang-kunang mengambang) sebagai elemen ambient di background; kartu-kartu dengan border tipis rose gold untuk section "alasan mencintaimu"; tipografi serif elegan untuk judul/love letter, sans-serif clean untuk teks pendukung.
- **Prinsip UX**: momen pembukaan (welcome page → konten utama) adalah titik emosional paling penting — transisinya harus terasa seperti "membuka kado", bukan sekadar loading screen. Tiap section sebaiknya punya jeda visual yang jelas (bukan menyatu tanpa batas) supaya terasa seperti menjelajahi "bab-bab" kejutan, bukan satu halaman panjang yang monoton.
- **Hindari "AI slop"**: desain harus menghindari pola default AI-generated yang generik dan gampang dikenali — contoh yang harus dihindari: gradient ungu-biru generik tanpa kedalaman, kombinasi warna cream + terracotta khas template AI, dark mode dengan satu aksen neon tanpa alasan, ikon emoji berlebihan di UI produksi, layout kartu/hero yang seragam dengan template SaaS generik, atau border-radius/shadow default tanpa niat desain. Warna ungu tua di sini harus dieksekusi dengan kedalaman (gradasi, tekstur halus, pencahayaan) dan aksen rose gold yang konsisten, bukan sekadar "background ungu polos" — supaya hasilnya terasa dirancang khusus untuk momen ini, bukan template yang kebetulan warnanya ungu.

## 8. Scope

### Dalam scope (in-scope)
- Single-page (atau multi-section dalam satu halaman) website statis, responsive, dengan animasi.
- Halaman welcome/gate dengan animasi transisi sebelum masuk konten utama.
- Semua fitur Fase 1 di Section 6.

### Di luar scope (out-of-scope)
- Backend/database, autentikasi/login, CMS admin.
- Multi-bahasa.
- Versi mobile app terpisah (native).
- Fitur Fase 2 (timeline hubungan) — dikerjakan belakangan kalau ada waktu/keinginan.

## 9. Alur Pengguna (User Flow)

1. Pasangan membuka link website → melihat halaman welcome dengan pesan pembuka dan elemen "klik untuk membuka".
2. Pasangan mengklik elemen tersebut → animasi transisi mewah berjalan (reveal ke konten utama).
3. Masuk ke halaman utama → musik latar mulai (atau muncul tombol "putar musik" kalau autoplay diblokir browser).
4. Pasangan scroll melewati section: galeri foto → love letter → alasan mencintaimu (interaktif) → (opsional) timeline → penutup/countdown.
5. Di bagian alasan mencintaimu, pasangan mengklik tiap kartu satu per satu untuk mengungkap isinya.
6. Pasangan sampai di section penutup dengan pesan dan animasi akhir sebagai penutup pengalaman.

## 10. Timeline

Tidak ada deadline yang ditentukan. Perkiraan urutan pengerjaan:
- **Fase 1**: prioritas utama, dikerjakan lebih dulu hingga selesai penuh (welcome page + semua section wajib + musik + penutup).
- **Fase 2**: dikerjakan setelah Fase 1 selesai dan dirasa masih ada waktu/keinginan menambah.

## 11. Risiko & Dependensi

- **Autoplay musik diblokir browser** — banyak browser modern memblokir autoplay dengan suara; perlu fallback UX (tombol "putar musik" yang jelas) supaya pengalaman tidak terasa rusak.
- **Konten personal belum tersedia saat build dimulai** — foto, isi love letter, list alasan, dan lagu pilihan harus disiapkan pemberi sebelum agent bisa mengisi konten sebenarnya (lihat Section 12).
- **Ketergantungan pada aset personal** — kualitas hasil akhir sangat bergantung pada foto yang dikumpulkan dan ketulusan isi teks, bukan cuma eksekusi teknis.
- **Hosting/distribusi** — perlu ditentukan bagaimana pasangan akan mengakses link ini (lihat Open Questions).

## 12. Open Questions & Assumptions

- **Nama project/website**: belum ditentukan (user memilih placeholder).
- **Konten personal (foto, isi love letter, list alasan mencintai, nama panggilan, lagu pilihan)**: user memilih untuk build dengan **placeholder** dulu, konten asli akan diisi belakangan oleh user sendiri. Karena itu, seluruh konten personal WAJIB disimpan di satu file config terpusat yang mudah diedit (lihat Section 13.2 & 13.6) — bukan di-hardcode tersebar di banyak file.
- **Hosting/distribusi**: belum ditentukan bagaimana link ini akan dibagikan ke pasangan (asumsi sementara: di-deploy ke hosting statis gratis seperti Vercel/Netlify/GitHub Pages, lalu link dikirim langsung).
- **Lagu latar spesifik**: belum ditentukan judul lagunya — perlu file audio atau link yang bisa diintegrasikan (perhatikan hak cipta kalau menggunakan file lagu komersial di hosting publik).

## 13. Agent Build Spec (untuk AI coding agent)

### 13.1 Tech Stack & Constraints
- **Rekomendasi tech stack**: HTML/CSS/JavaScript murni atau React + Tailwind (single-page, static site) — pilih berdasarkan preferensi agent/tooling yang tersedia, tidak ada requirement backend. *(Perlu dikonfirmasi user kalau punya preferensi stack tertentu.)*
- **Codebase**: greenfield, dibangun dari nol.
- **Infra/deployment**: static hosting gratis (Vercel/Netlify/GitHub Pages) — konfirmasi ke user sebelum deploy ke tempat yang bisa diakses publik, karena isinya sangat personal (lihat catatan privasi di Section 6).
- UI harus mengikuti arahan Section 7 secara ketat, terutama poin "Hindari AI slop" — agent tidak boleh memilih palet/layout default generik hanya karena tidak eksplisit dilarang.

### 13.2 Data Model

Karena ini static site tanpa backend dan seluruh konten personal masih berupa **placeholder** yang akan diganti user sendiri nanti, semua data konten WAJIB disimpan di **satu file config terpusat** (mis. `content.js`/`content.json` di root project) — bukan tersebar di banyak file komponen. Tiap field diberi placeholder yang jelas dan komentar penjelas, supaya user tinggal buka satu file dan mengganti isinya tanpa perlu menyentuh kode/animasi.

| Entitas | Field | Tipe | Keterangan |
|---------|-------|------|------------|
| WelcomeConfig | pesanPembuka | string | Kalimat pembuka di halaman welcome — placeholder mis. `"[Tulis pesan pembukamu di sini]"` |
| WelcomeConfig | namaPanggilan | string | Nama panggilan pasangan — placeholder mis. `"[Nama Panggilan]"` |
| Foto | url, caption | string | Satu entri per foto di galeri — placeholder pakai gambar dummy + caption `"[Caption foto]"` |
| LoveLetter | isi | text (markdown/paragraf) | Isi surat cinta lengkap — placeholder beberapa paragraf contoh berlabel jelas |
| AlasanCinta | teks | string | Satu entri per kartu alasan — placeholder minimal 5 entri contoh |
| MusikLatar | fileUrl / linkUrl | string | Sumber file audio lagu latar — placeholder kosong dengan instruksi format file yang diterima |
| PesanPenutup | isi | string | Kalimat penutup di section akhir — placeholder contoh kalimat penutup |

### 13.3 API / Integration Contracts
Tidak ada integrasi eksternal wajib. Jika lagu latar disimpan sebagai file, cukup asset audio lokal (`.mp3`) yang dimuat lewat elemen `<audio>` — tidak perlu API eksternal kecuali user ingin embed dari platform streaming (perlu dikonfirmasi dulu ke user).

### 13.4 Task Breakdown (Checklist untuk Agent)

#### Fase 1

- [ ] **TASK-1**: Setup project (struktur folder, tooling dasar sesuai stack yang dipilih)
  - **Acceptance criteria**: project bisa dijalankan lokal tanpa error, struktur folder siap untuk section-section berikutnya.
- [ ] **TASK-1B**: Buat file config konten terpusat (`content.js`/`content.json`) berisi seluruh field di Section 13.2 dengan placeholder yang jelas dan berlabel
  - **Acceptance criteria**: satu file berisi semua teks/foto/link musik yang dipakai di seluruh section; tiap field placeholder mudah dikenali (mis. dibungkus `[...]` atau komentar `// GANTI DI SINI`); tidak ada teks/foto konten personal yang di-hardcode langsung di file komponen selain lewat file config ini; ada instruksi singkat (komentar/README) cara mengganti tiap jenis konten (teks, foto, audio).
  - **Depends on**: TASK-1
- [ ] **TASK-2**: Bangun halaman Welcome/Gate dengan elemen "klik untuk membuka" dan animasi transisi ke konten utama
  - **Acceptance criteria**: saat elemen diklik, terjadi animasi transisi (bukan perpindahan instan) menuju halaman utama; welcome page tidak menampilkan konten utama sebelum diklik.
  - **Depends on**: TASK-1
- [ ] **TASK-3**: Implementasi tema visual global (palet warna deep purple + rose gold, tipografi, partikel ambient) sesuai Section 7
  - **Acceptance criteria**: variabel warna/tipografi terpusat (CSS variables/theme config) dan dipakai konsisten di semua section; ada elemen partikel ambient (bintang/kunang-kunang) yang terlihat di background.
  - **Depends on**: TASK-1
- [ ] **TASK-4**: Bangun section Galeri Foto dengan animasi fade-in/scroll-reveal
  - **Acceptance criteria**: foto dari data config tampil dalam grid/carousel; ada animasi saat foto masuk ke viewport.
  - **Depends on**: TASK-3
- [ ] **TASK-5**: Bangun section Love Letter dengan layout surat dan animasi reveal teks bertahap
  - **Acceptance criteria**: teks love letter muncul bertahap saat di-scroll (bukan langsung semua tampil); layout terasa seperti surat, bukan paragraf polos.
  - **Depends on**: TASK-3
- [ ] **TASK-6**: Bangun section Alasan Mencintaimu dengan kartu interaktif klik-untuk-buka
  - **Acceptance criteria**: tiap alasan tersembunyi di balik kartu; klik pada kartu memicu animasi (flip/fade) yang mengungkap isinya; semua kartu bisa dibuka independen satu sama lain.
  - **Depends on**: TASK-3
- [ ] **TASK-7**: Integrasi musik latar dengan kontrol mute/unmute dan fallback untuk autoplay yang diblokir
  - **Acceptance criteria**: musik mencoba autoplay saat masuk konten utama; jika diblokir browser, muncul tombol "putar musik" yang jelas; ada tombol mute/unmute yang selalu terlihat/mudah diakses.
  - **Depends on**: TASK-2
- [ ] **TASK-8**: Bangun section penutup dengan pesan personal dan animasi akhir
  - **Acceptance criteria**: section penutup menampilkan pesan dari data config dan animasi visual penutup (misal partikel/cahaya) saat section ini masuk viewport.
  - **Depends on**: TASK-3
- [ ] **TASK-9**: Cegah indexing oleh search engine dan review kemudahan akses link
  - **Acceptance criteria**: ada `robots.txt`/meta noindex yang mencegah search engine mengindeks halaman; link tidak didaftarkan ke direktori publik mana pun.
  - **Depends on**: TASK-1
- [ ] **TASK-10**: Testing responsive di ukuran layar mobile & optimasi performa animasi
  - **Acceptance criteria**: seluruh section tampil rapi di lebar layar mobile umum (360–430px) tanpa elemen terpotong/overflow; animasi tidak menyebabkan lag terasa di perangkat mobile kelas menengah.
  - **Depends on**: TASK-2, TASK-4, TASK-5, TASK-6, TASK-7, TASK-8

#### Fase 2

- [ ] **TASK-11**: Bangun section Timeline Perjalanan Hubungan dengan animasi scroll-triggered
  - **Acceptance criteria**: momen-momen dari data config tampil berurutan di linimasa; tiap titik linimasa muncul dengan animasi saat discroll ke posisinya.
  - **Depends on**: TASK-3

### 13.5 Edge Cases & Error Handling

- **Konten personal belum diisi**: karena disepakati build dimulai dengan placeholder, agent TIDAK perlu berhenti untuk meminta konten asli — cukup isi field di file config (TASK-1B) dengan placeholder yang jelas dan mudah dikenali, dan pastikan tiap field punya label/instruksi cara menggantinya nanti.
- **Autoplay musik gagal**: tangani dengan fallback tombol manual (lihat TASK-7), jangan biarkan silent fail tanpa indikasi ke user.
- **Foto dengan rasio/ukuran berbeda-beda**: pastikan layout galeri tetap rapi (gunakan object-fit/cropping konsisten) walau foto punya rasio berbeda.
- **Layar sangat kecil atau sangat besar**: pastikan animasi dan layout tetap wajar di ukuran ekstrem (HP kecil maupun layar desktop besar).

### 13.6 Batas Otonomi Agent (Guardrails)

- **Boleh diputuskan sendiri oleh agent**: detail teknis implementasi animasi, struktur kode, pemilihan library animasi ringan, detail spacing/layout selama konsisten dengan Section 7.
- **Boleh diisi dengan placeholder tanpa konfirmasi**: seluruh konten personal (love letter, list alasan mencintai, foto, nama panggilan, lagu latar) — asal ditempatkan di file config terpusat (TASK-1B) dengan label placeholder yang jelas dan mudah diganti user sendiri nanti.
- **WAJIB dikonfirmasi ke user dulu**:
  - Keputusan hosting/deploy ke platform yang bisa diakses publik (karena isinya sangat personal).
  - Pemilihan tech stack besar jika berbeda dari rekomendasi di Section 13.1.