# Panduan Setup Admin (Role-Based Access Control)

Sistem MiqStore menggunakan **Role-Based Access Control (RBAC)** untuk membedakan antara `USER` biasa dan `ADMIN`. Secara default, setiap user yang mendaftar atau login via Google akan mendapatkan role `USER`.

Untuk mengakses **Admin Panel** (`/admin`), sebuah akun harus memiliki role `ADMIN` atau `SUPER_ADMIN`.

## Cara Menjadikan Akun Sebagai Admin

Karena NextAuth tidak mengizinkan pergantian role secara langsung dari client-side untuk alasan keamanan, kamu perlu mengubah role akunmu langsung melalui database (Neon Postgres).

### Langkah-langkah:
1. Pastikan kamu sudah mendaftar/login setidaknya sekali menggunakan akun yang ingin dijadikan Admin (misalnya via Google Login).
2. Buka **Neon Console** (atau SQL Editor pilihanmu yang terhubung ke database `DATABASE_URL`).
3. Jalankan query SQL berikut:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'email_kamu@gmail.com';
```
*(Ganti `email_kamu@gmail.com` dengan email yang kamu gunakan saat login).*

### Refresh Session
Setelah menjalankan query di atas, role di database sudah berubah. Namun, JWT Session di browser kamu masih menyimpan role lama (`USER`). 
Untuk mengatasinya:
1. Buka website MiqStore.
2. Klik tombol **Logout** / Keluar.
3. Lakukan **Login kembali** dengan akun tersebut.

Setelah login ulang, sistem akan mendeteksi role baru kamu. Sebuah menu khusus **"Admin Panel"** akan muncul di sidebar kiri Dashboard kamu, dan kamu sekarang memiliki akses penuh ke rute `/admin`.

---

### Catatan Keamanan (Middleware)
- Middleware di `src/middleware.ts` secara ketat menjaga folder `/admin`. Jika kamu mencoba masuk ke `/admin` tanpa melalui langkah di atas, kamu akan otomatis ditendang kembali ke `/dashboard`.
