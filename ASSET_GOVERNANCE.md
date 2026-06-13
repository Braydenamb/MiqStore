# 🖼️ Asset Governance & Guidelines

> **English Summary**: All image assets in MiqStore must follow strict naming, folder structure, format, and size standards to maintain UI consistency, prevent repository bloat, and ensure optimal loading performance. This document is the single source of truth for asset management.

---

Untuk menjaga konsistensi UI, mencegah redundansi ukuran repositori, dan menjamin kecepatan muat (*loading speed*) situs MiqStore yang optimal, seluruh penambahan maupun perubahan aset gambar **WAJIB** mengikuti standarisasi di bawah ini.

---

## 1. Naming Convention

Setiap aset yang diunggah harus mematuhi format penamaan **`kebab-case`**.

- ✅ **Benar:** `mobile-legends.webp`, `ovo-payment.svg`, `summer-promo-banner.webp`
- ❌ **Salah:** `MobileLegends.webp`, `OVO_Payment.svg`, `summer promo banner.webp`

---

## 2. Folder Structure

Aset harus ditempatkan ke dalam subdirektori fungsional di bawah `/public/images/` untuk mencegah penumpukan di *root* dan kebingungan arsitektur.

```
public/
└── images/
    ├── games/       # Poster, ikon, dan thumbnail permainan
    ├── payments/    # Logo bank, e-wallet, dan metode pembayaran
    └── banners/     # Grafis pemasaran, karosel (carousel), dan promo
```

> **Catatan**: Aset yang diunggah melalui Admin Gallery menggunakan **Cloudinary** dan tidak disimpan di folder `public/`. Aturan ini berlaku untuk aset statis yang di-commit langsung ke repositori.

---

## 3. Strict Rules & Constraints

### 🔸 Ukuran Maksimal (Max Size)
- **Batas Mutlak:** `< 300 KB` per gambar.
- **Rekomendasi:** Untuk gambar di atas 300 KB, wajib dikompresi sebelum *commit*!
- **Tool:** Gunakan `convert_images.py` di root proyek untuk konversi batch ke WebP.

### 🔸 Format Ekstensi
- **HANYA `.webp`** untuk gambar statis / fotografi ringan.
- *Pengecualian:* Ikon warna solid / vektor dapat menggunakan format `.svg`.
- Format `.jpg` dan `.png` **dilarang keras** kecuali dalam keadaan sangat mendesak.

### 🔸 Standar Dimensi (Resolution)
Gunakan rasio dimensi yang disepakati ini sebelum gambar dipotong (*crop*):

| Jenis Aset | Dimensi | Rasio |
|---|---|---|
| Game Card (Poster/Thumbnail) | `512 × 512 px` | 1:1 |
| Promo Banner (Hero/News) | `1920 × 1080 px` | 16:9 |
| Payment Logo | `200 × 80 px` | ~5:2 |

---

## 4. Cloudinary Assets (Admin Upload)

Aset yang diunggah melalui **Admin Panel → Gallery** disimpan di Cloudinary, bukan di folder `public/`. Aturan berikut berlaku untuk Cloudinary uploads:

- Gunakan folder Cloudinary yang sesuai: `miqstore/games/`, `miqstore/banners/`, `miqstore/payments/`.
- Cloudinary akan otomatis mengoptimalkan format dan kualitas via `next-cloudinary` (`CldImage` dengan `format="auto"` dan `quality="auto"`).
- Setelah menghapus aset dari Admin Gallery, pastikan aset juga dihapus dari Cloudinary Dashboard untuk menghindari storage leak.

---

> *Penetapan standar (Asset Governance) ini dibangun untuk mencegah kekacauan jangka panjang, inkonsistensi UI, dan duplikasi data yang sering menjadi kelemahan banyak proyek skalabilitas tinggi.*
