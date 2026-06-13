# Panduan Setup Admin (Role-Based Access Control)

Sistem MiqStore menggunakan **Role-Based Access Control (RBAC)** dengan empat level role: `USER` → `RESELLER` → `ADMIN` → `SUPER_ADMIN`.

Secara default, setiap user yang mendaftar atau login via Google OAuth akan mendapatkan role `USER`.

Untuk mengakses **Admin Panel** (`/admin`), sebuah akun harus memiliki role `ADMIN` atau `SUPER_ADMIN`.

---

## Perbedaan ADMIN vs SUPER_ADMIN

| Kemampuan | USER | ADMIN | SUPER_ADMIN |
|---|---|---|---|
| Top-up & Dashboard | ✅ | ✅ | ✅ |
| Kelola Games & Produk | ❌ | ✅ | ✅ |
| Kelola Orders & Users | ❌ | ✅ | ✅ |
| Kelola Settings & System | ❌ | ✅ | ✅ |
| Promote user ke ADMIN | ❌ | ❌ | ✅ (manual SQL) |

---

## Cara Menjadikan Akun Sebagai Admin

Karena NextAuth tidak mengizinkan perubahan role secara langsung dari client-side (untuk alasan keamanan), role harus diubah langsung melalui database.

### Opsi 1: Menggunakan Script (Direkomendasikan)

Proyek menyediakan script `set-admin.ts` di root direktori:

```bash
# Ubah email sesuai akun yang ingin dijadikan admin
pnpm ts-node --compiler-options '{"module":"CommonJS"}' set-admin.ts
```

> Edit file `set-admin.ts` terlebih dahulu untuk memasukkan email target.

### Opsi 2: Menggunakan SQL Langsung

1. Pastikan akun target sudah pernah login setidaknya sekali.
2. Buka SQL Editor yang terhubung ke `DATABASE_URL` (Neon Console, TablePlus, Prisma Studio, dll).
3. Jalankan query berikut:

```sql
UPDATE "users" SET role = 'ADMIN' WHERE email = 'email_kamu@gmail.com';
```

*(Ganti `email_kamu@gmail.com` dengan email yang digunakan saat login. Untuk `SUPER_ADMIN`, ubah nilai menjadi `'SUPER_ADMIN'`.)*

### Opsi 3: Menggunakan Prisma Studio

```bash
pnpm db:studio
```

Buka tabel `users`, cari user berdasarkan email, dan ubah kolom `role` secara langsung melalui antarmuka visual.

---

## Refresh Session Setelah Perubahan Role

Setelah role diubah di database, **JWT Session di browser masih menyimpan role lama**. Untuk mengatasinya:

1. Buka website MiqStore.
2. Klik **Logout / Keluar**.
3. Login kembali dengan akun tersebut.

Setelah login ulang, menu **Admin Panel** akan muncul di sidebar dashboard, dan akses ke `/admin` akan aktif.

---

## Catatan Keamanan (Middleware)

- Middleware di `src/middleware.ts` secara ketat menjaga seluruh folder `/admin`.
- Jika user mencoba mengakses `/admin` tanpa role `ADMIN` atau `SUPER_ADMIN`, middleware akan otomatis me-redirect ke `/dashboard`.
- Middleware juga menyuntikkan security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) pada setiap response.
- Semua aksi admin (create, update, delete) dicatat di tabel `admin_audit_logs` untuk keperluan audit dan compliance.
