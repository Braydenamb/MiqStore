# 🖼️ Asset Governance & Guidelines

Untuk menjaga konsistensi UI, mencegah redundansi ukuran repositori, dan menjamin kecepatan muat (*loading speed*) situs MiqStore yang optimal, seluruh penambahan maupun perubahan aset gambar **WAJIB** mengikuti standarisasi di bawah ini:

## 1. Naming Convention
Setiap aset yang diunggah harus mematuhi format penamaan **`kebab-case`**.
- ✅ **Benar:** `mobile-legends.webp`, `ovo-payment.svg`, `summer-promo-banner.webp`
- ❌ **Salah:** `MobileLegends.webp`, `OVO_Payment.svg`, `summer promo banner.webp`

## 2. Folder Structure
Aset harus ditempatkan ke dalam subdirektori fungsional di bawah `/public/images/` untuk mencegah penumpukan di *root* dan kebingungan arsitektur.
- `/public/images/games/` : Khusus untuk poster/ikon permainan.
- `/public/images/payments/` : Khusus untuk logo bank/e-wallet/pembayaran.
- `/public/images/banners/` : Khusus untuk grafis pemasaran, karosel (*carousel*), dan promo.

## 3. Strict Rules & Constraints

### 🔸 Ukuran Maksimal (Max Size)
- **Batas Mutlak:** `< 300 KB` per gambar.
- **Rekomendasi:** Untuk gambar di atas 300 KB, wajb dikompresi sebelum *commit*! 

### 🔸 Format Ekstensi
- **HANYA `webp`** (untuk gambar statis / fotografi ringan).
- *Pengecualian:* Ikon warna solid dapat menggunakan format `.svg`. Format `.jpg` dan `.png` **dilarang keras** kecuali dalam keadaan sangat mendesak.

### 🔸 Standar Dimensi (Resolution)
Untuk menjaga UI tidak pecah atau bergeser secara tidak terprediksi, gunakan rasio dimensi yang disepakati ini sebelum gambar dipotong (*crop*):
- **Game Card (Poster/Thumbnail):** `512 x 512px` (Rasio 1:1)
- **Promo Banner (Hero/News):** `1920 x 1080px` (Rasio 16:9)

---
> *Penetapan standar (*Asset Governance*) ini dibangun untuk mencegah kekacauan jangka panjang, inkonsistensi UI, dan duplikasi data yang sering menjadi kelemahan banyak proyek skalabilitas tinggi.*
