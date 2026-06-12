# Sistem Aset Manajemen

Sistem informasi berbasis web untuk mengelola aset barang secara terpusat, mencakup pencatatan barang masuk/keluar, monitoring stok real-time, dan export laporan dalam format PDF.

## Fitur Utama

- **Authentication & Authorization**: Login sebagai Admin atau Staff.
- **Dashboard**: Statistik realtime dan chart barang.
- **Master Data**: Kelola kategori dan data aset.
- **QR Code Generator**: Otomatis menghasilkan QR code untuk setiap barang aset.
- **Transaksi Inventaris**: Catat barang masuk (menambah stok) dan barang keluar (mengurangi stok).
- **Laporan**: Unduh rekapitulasi data aset dalam format PDF.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js, Sequelize ORM.
- **Database**: MySQL.

---

## Panduan Instalasi dan Menjalankan (Deployment Guide)

### Persiapan
1. Pastikan **Node.js** terinstal di komputer.
2. Pastikan **MySQL Server** (XAMPP/WAMP) sudah berjalan.

### 1. Konfigurasi Backend
1. Masuk ke direktori backend: `cd backend`
2. Konfigurasi file `.env` di dalam folder backend. Ubah `DB_PASS` sesuai password root MySQL Anda (jika kosong biarkan saja).
3. Jalankan command:
   ```bash
   npm install
   node src/utils/init-db.js
   node src/utils/seeder.js
   ```
   *(Script ini akan menginisialisasi database `db_sistem_aset`, membuat tabel, dan mengisi dummy data).*
4. Nyalakan server backend:
   ```bash
   node server.js
   ```
   Server akan berjalan di port `5000`.

### 2. Konfigurasi Frontend
1. Buka terminal baru dan masuk ke direktori frontend: `cd frontend`
2. Install modul (jika belum di terminal sebelumnya):
   ```bash
   npm install
   ```
3. Nyalakan React App:
   ```bash
   npm run dev
   ```
4. Buka URL yang diberikan Vite (biasanya `http://localhost:5173`) di browser.

### Akun Dummy untuk Login
- **Admin**: Username: `admin`, Password: `password123`
- **Staff**: Username: `staff`, Password: `password123`

---

*Dikembangkan untuk Tugas / Project Enterprise Asset Management.*
