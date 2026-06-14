Pendahuluan 🆕
Tentang
APIgames.id membantu para seller voucher games untuk melakukan pembelian produk di KiosGamer, SmileOne, Unipin , Duniagames , Razer Gold dain lainnya

Cara Kerja
Pada dasarnya APIGames hanya perantara untuk membantu melakukan pembelian produk di KiosGamer, SmileOne, Unipin , Duniagames , Razer Gold dain lainnya via API yang jauh lebih mudah. Akun yang digunakan tetap akun anda.

warning
apigames merupakan pihak ketiga yang meneruskan transaksi kamu ke provider game, apabila terjadi kesalahan dipihak provider kami akan tetap mengenakan biaya walaupun transaksi kamu tidak berhasil !

info
Jika Anda membutuhkan Bantuan terkait pengaturan Koneksi dll, silahkan hubungi kami melalui Email ke Support Apigames atau kunjungi halaman bantuan untuk pertanyaan umum di Support Apigames; Persiapan Awal
Kunjungi Pengaturan Koneksi untuk setting kiosgamer / smile one coin
Dapatkan Secret Key & Merchant ID di halaman Pengaturan Secret Key
Silahkan set Content-Type pada header menjadi application/json
Seluruh transaksi via API akan menggunakan method GET & POST
info
Semua request pada API menggunakan URL :

https://v1.apigames.id; Info Akun
Untuk melakukan pengecekan informasi akun apigames kamu

Endpoint
https://v1.apigames.id/merchant/[merchant_id]?signature=[signature]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
signature	Signature Cek akun dengan formula md5(MERCHANT_ID:SECRET_KEY)	String	Ya
Contoh
https://v1.apigames.id/merchant/YOUR-MERCHANT-ID?signature=YOUR-SIGNATURE-HERE
Response Info Akun
{
    "status": 1,
    "rc": 200,
    "message": "Sukses",
    "data": {
        "id": 1,
        "merchant_id": "M2YOURMERCHANTID",
        "email": "youremail@gmail.com",
        "hp": "0839834938",
        "nama": "YOUR NAME",
        "saldo": 19690000
    },
    "ts": 1657527892
}; Cek Akun Game
Melakukan pengecekan akun game, saat ini tersedia untuk Free Fire, Mobile Legend, dan Higgs

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-username/[game_code]?user_id=[user_id]&signature=[singature]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
game_code	Kode game yang ingin dicek tersedia mobilelegend , freefire	String	Ya
user_id	User ID akun yang akan dicek	String	Ya
signature	Signature Cek akun dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/YOUR-MERCHANT-ID/cek-username/mobilelegend?user_id=101990303&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response Cek Akun Freefire
{
    "status": 1,
    "rc": 0,
    "message": "Data Found",
    "data": {
        "is_valid": true,
        "username": "¥Vino_TZY™"
    },
    "ts": 1650529219
}"status": 1
}
Response Cek Akun Mobile Legend
{
    "status": 1,
    "rc": 0,
    "message": "Data Found",
    "data": {
        "is_valid": true,
        "username": "•CUMAN BISA MM•"
    },
    "ts": 1650529102
}
Response Gagal
{
    "status": 1,
    "rc": 0,
    "message": "Data Not Found",
    "data": {
        "is_valid": false,
        "username": ""
    },
    "ts": 1650529145
}; Deposit
warning
Merupakan API untuk deposit SALDO APIGAMES. Untuk saat ini hanya support via Transfer Bank.

Endpoint
https://v1.apigames.id/v2/deposit-get?merchant=[YOUR_MERCHANT_CODE]&nominal=[NOMINAL]&secret=[YOUR_SECRET]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
nominal	Nominal Deposit Anda	String	Ya
secret	Secret Key Anda Lihat Pengaturan Secret Key	String	Ya
Contoh
https://v1.apigames.id/v2/deposit-get?merchant=[YOUR_MERCHANT_CODE]&nominal=100000&secret=[YOUR_SECRET]
Response Deposit
{
    "status": 1,
    "rc": 200,
    "message": "tiket deposit",
    "data": {
        "admin": 2000,
        "expired": "2023-02-22 23:59:00",
        "id": 46,
        "kode_unik": 3,
        "nominal": 10000,
        "rekening": "BCA 8455510119 An Dewa",
        "total_transfer": 12003
    },
    "ts": 1677058571
}; Cek Koneksi Higgs
Melakukan pengecekan koneksi higgs menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=higgs&signature=[signature_redeem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=higgs&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 0,
    "message": "Terkoneksi dengan akun mitra higgs MD1790873",
    "data": {
        "data": {
            "coin_1m": 277,
            "coin_60m": 122,
            "coin_200m": 80,
            "coin_600m": 130,
            "coin_1b": 1,
            "coin_2b": 0
        },
        "is_valid": true
    },
    "ts": 1646973543
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine higgsj belum tersedia"
}; Cek Koneksi Kiosgamer
Melakukan pengecekan koneksi kiosgamer menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=kiosgamer&signature=[signature_redem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=kiosgamer&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 200,
    "message": "Data Found",
    "data": {
        "data": {
            "garena_id": "544231487",
            "username": "apigames",
            "uuid": "60a7e99cfb524673a00b5c52ddaabb1f",
            "topup_to_friend": true,
            "shell_balance": 746660,
            "icon": "https://cdngarenanow-a.akamaihd.net/webmain/static/images/avatars/default.jpg",
            "expiry_time": 1648196000,
            "expiry_date": ""
        },
        "is_valid": true
    },
    "ts": 1647398605
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine higgsj belum tersedia"
}; Cek Koneksi Smile One
Melakukan pengecekan koneksi smileone menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=smileone&signature=[signature_redem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=smileone&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 50,
    "message": "Data Found",
    "data": {
        "data": {
            "loginStatus": true,
            "favorite": false,
            "favorite_product_count": 0,
            "customer_name": "Apigames.id"
        },
        "is_valid": true
    },
    "ts": 1647398685
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine higgsj belum tersedia"
}; Cek Koneksi Unipin Brazil
Melakukan pengecekan koneksi unipin brazil menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=unipinbr&signature=[signature_redem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, unipin,unipinbr,unipinmy, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=unipin&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 200,
    "message": "Connected",
    "data": [{
        "name": "Apigames",
        "email": "cs@apigames.id",
        "up_balance": 343,
        "uc_balance": 43434
    }],
    "ts": 1649386566
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine unipin belum tersedia"
}; Cek Koneksi Unipin Malaysia
Melakukan pengecekan koneksi unipin malaysia menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=unipinmy&signature=[signature_redem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, unipin,unipinbr,unipinmy, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=unipin&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 200,
    "message": "Connected",
    "data": [{
        "name": "Apigames",
        "email": "cs@apigames.id",
        "up_balance": 343,
        "uc_balance": 43434
    }],
    "ts": 1649386566
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine unipin belum tersedia"
}; Cek Koneksi Unipin
Melakukan pengecekan koneksi unipin menggunakan metode GET

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/cek-koneksi?engine=unipin&signature=[signature_redem]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
engine	Koneksi engine. Misal: smileone, unipin, kiosgamer, higgs	String	Ya
signature	Signature Radeem dengan formula md5(merchant_id+secret_key)	String	Ya
Contoh
https://v1.apigames.id/merchant/M220122DEWA6374A/cek-koneksi?engine=unipin&signature=e27e38e3f9gd78dfe93t2898b74982b9
Response
Contoh Response Sukses
{
    "status": 1,
    "rc": 200,
    "message": "Connected",
    "data": [{
        "name": "Apigames",
        "email": "cs@apigames.id",
        "up_balance": 343,
        "uc_balance": 43434
    }],
    "ts": 1649386566
}
Contoh Response Gagal
{
    "status": 0,
    "rc": 50,
    "error_msg": "Engine unipin belum tersedia"
}; Radeem Voucher Garena Shell Kiosgamer
Melakukan radeem voucher secara bulk (lebih dari 1 voucher) menggunakan method POST

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/kiosgamer/redem/bulk
HTTP Method
POST
Request
Deskripsi
Berikut adalah struktur JSON yang diharapkan:

Parameter	Deskripsi	Tipe Data	Wajib
kode_voucher	Base64 dari list voucher anda, bisa menggunakan bantuan [Base64Encode] (https://www.base64encode.org/) atau library dari bahasa yang anda gunakan. Jangan lupa pisahkan dengan enter di setiap kode voucher	String	Ya
session_key	Session Key Kiosgamer anda, jika di kosongkan akan mengambil data session key dari koneksi akun	String	Tidak
signature	Signature dengan formula md5(merchant_id + secret_key)	String	Ya
Contoh

{
    "kode_voucher":"d2VmZXdmd2Vmd2VmZXdmCndlZmV3ZndlZndlZndlZndlZgp3ZWZ3ZWZ3ZWZld2Zld2Y=",
    "signature":"fa375f4e30dbe2cdcf5d1ee0e9d678ef",
    "session_key":"nfeiwin34nin43infi3f"

}
Response
Deskripsi
Contoh Response Sukses
{
  "status": 1,
  "rc": 0,
  "message": "Sukses Memasukan Voucher Ke Antrian",
   "data": {
        "id": 23,
        "merchant_id": "M220122XXXX374A",
        "project_id": "R220414JXXX0021",
        "project_name": "R220414JXXXXXX021",
        "total_voucher": 0,
        "total_cost": 0,
        "total_bayar": 0,
        "saldo_before_trx": 0,
        "saldo_after_trx": 0,
        "unipin_session": "",
        "unipin_xsrf_token": "4rwer",
        "unipin_token_redeem": "",
        "unipin_email": "admin@xxxx.net",
        "balance_uc_start": 0,
        "balance_uc_end": 0,
        "balance_up_start": 0,
        "balance_up_end": 0,
        "s_pending": 0,
        "s_success": 0,
        "s_process": 0,
        "s_error_engine": 0,
        "s_error_voucher": 0,
        "created": "",
        "created_at": "",
        "status": 0,
        "updated_at": ""
    },
  "ts": 1705312200
}
Contoh Response Gagal
1. Missing Required Fields
{
  "status": 0,
  "rc": 500,
  "error_msg": "JSON tidak valid"
}
2. Invalid Signature
{
  "status": 0,
  "rc": 500,
  "error_msg": "Signature Not Valid"
}
3. Maintenance Mode
{
  "status": 0,
  "rc": 500,
  "error_msg": "Redem sedang maintenance"
}
4. Invalid Base64 Voucher
{
  "status": 0,
  "rc": 500,
  "error_msg": "Data voucher bulk harus dalam bentuk bas64encode"
}
5. Merchant Not Found
{
  "status": 0,
  "rc": 500,
  "error_msg": "Merchant not found"
}
6. Merchant Config Error
{
  "status": 0,
  "rc": 500,
  "error_msg": "Merchant config not found"
}
7. Account Info Error
{
  "status": 0,
  "rc": 500,
  "error_msg": "Error getting account info from KiosGamer"
}
8. Project Creation Error
{
  "status": 0,
  "rc": 500,
  "error_msg": "Error creating project redemption"
}
9. Voucher Insertion Error
{
  "status": 0,
  "rc": 500,
  "error_msg": "Error inserting voucher data"
}
10. Duplicate Voucher Error
{
  "status": 0,
  "rc": 500,
  "error_msg": "Voucher ini double, sudah ada sebelumnya"
}; Cek Status Radeem
Melakukan radeem voucher secara bulk (lebih dari 1 voucher) menggunakan method POST

Endpoint
https://v1.apigames.id/merchant/[merchant_id]/kiosgamer/project/detail
HTTP Method
POST
Request
Deskripsi
Berikut adalah struktur JSON yang diharapkan:

Parameter	Deskripsi	Tipe Data	Wajib
session_key	Session Key Kiosgamer anda	String	Ya
signature	Signature dengan formula md5(merchant_id + secret_key)	String	Ya
Contoh
{
    "projectid":"DW",
    "status":"", //kosong jika tidak melakukan pencarian by status
    "page":1,
    "limit":30,
    "signature":"fa375f4e30dbe2cdcf5d1ee0e9d678ef"
}
Response
Deskripsi
Contoh Response Sukses
{
    "status": 1,
    "rc": 200,
    "message": "List Voucher Redem Kiosgamer",
    "data": {
        "current_page": 1,
        "data": {
            "id": 5847,
            "merchant_id": "M240315GAME2847K",
            "project_id": "R240815XPQR000012",
            "total_voucher": 3,
            "vouchers": [
                {
                    "id": 23456,
                    "project_id": "R240815XPQR000012",
                    "voucher_code": "ABC123DEF456GHI",
                    "response_json": "",
                    "note": "-",
                    "nominal_gs": 0,
                    "created": "2024-08-15",
                    "cretaed_at": "2024-08-15 14:32:18",
                    "updated_at": "2024-08-15 14:32:18",
                    "status": 0
                },
                {
                    "id": 23455,
                    "project_id": "R240815XPQR000012",
                    "voucher_code": "JKL789MNO012PQR",
                    "response_json": "",
                    "note": "-",
                    "nominal_gs": 0,
                    "created": "2024-08-15",
                    "cretaed_at": "2024-08-15 14:32:18",
                    "updated_at": "2024-08-15 14:32:18",
                    "status": 0
                },
                {
                    "id": 23454,
                    "project_id": "R240815XPQR000012",
                    "voucher_code": "STU345VWX678YZ9",
                    "response_json": "",
                    "note": "-",
                    "nominal_gs": 25,
                    "created": "2024-08-15",
                    "cretaed_at": "2024-08-15 14:32:18",
                    "updated_at": "2024-08-15 14:32:18",
                    "status": 0
                }
            ],
            "kategori_voucher": [
                {
                    "name": "0",
                    "total": 2
                },
                {
                    "name": "25",
                    "total": 1
                }
            ],
            "stats": {
                "pending": 3,
                "success": 0,
                "process": 0,
                "error_engine": 0,
                "error_voucher": 0
            }
        },
        "total_data": 3,
        "total_page": 1
    },
    "ts": 1723719138
}
Contoh Response Gagal
1. Invalid JSON Data
{
  "status": 0,
  "rc": 400,
  "error_msg": "Data JSON tidak valid"
}
2. Merchant Not Found
{
  "status": 0,
  "rc": 500,
  "error_msg": "Merchant not found"
}
3. Invalid Signature
{
  "status": 0,
  "rc": 500,
  "error_msg": "Signature Not Valid"
}
4. Project Not Found
{
  "status": 0,
  "rc": 500,
  "error_msg": "Project ID tidak ditemukan"
}; Syarat & Ketentuan ! 🆕
warning
Ada beberapa poin yang perlu di pahami:

Semua HTTP Error harus diset sebagai transaksi Pending
NETWORK TIMEOUT harus diset sebagai transaksi Pending
Flow transaksi, pada awal transaksi respon diberikan PENDING, untukn mendapatkan status transaksi terbaru bisa menggunakan API CEK STATUS atau melalui WEBHOOK di halaman pengaturan webhook
status transaksi dari apigames : Pending, Sukses, Gagal, Proses, Sukses Sebagian, Validasi Provider
info
STATUS TRANSAKSI

Pending, transaksi awal

Sukses, transaksi sukses dilakukan

Gagal, transaksi gagal dilakukan

Proses, transaksi sedang diproses

Sukses Sebagian, dikarenakan beberapa produk di apigames merupakan gabungan dari produk nominal lainnya, contoh seperti ML 15 DIAMOND merupakan gabungan dari ML 5 DIAMOND dan ML 10 DIAMOND, artinya apigames harus melakukan 2x transaksi, namun yang sukses hanya sebagian.

Validasi Provider, apigames tidak mendapatkan response yang seharusnya, seperti provider down atau error lainnya yang tidak dikenali oleh apigames.

warning
Untuk mendapatkan status transaksi terbaru JANGAN hit ke API transaksi, tapi lakukan dengan API CEK STATUS TRANSAKSI atau menunggu dari WEBHOOK / REPORT yang apigames kirimkan.

Pada MEMBER AREA, sudah ditambahkan tombol resend WEBHOOK / REPORT manual

warning
Status transaksi yang di percaya hanya dari WEBHOOK / REPORT dan API CEK STATUS TRANSAKSI berdasarkan status yang sudah tertera di atas.; Method GET
Melakukan pembelian produk menggunakan Metode GET VERSI 2

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi?ref_id=[ref_id]&merchant_id=[merchant_id]&produk=[kode_produk]&tujuan=[tujuan]&signature=[signature]&server_id=[server_id]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
ref_id	Ref ID unik Anda	String	Ya
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
produk	Kode Produk Bisa menggunakan prefix custom misalnya AGML80 untuk produk ML80	String	Ya
tujuan	Tujuan Pengisian	String	Ya
server_id	Jika produk tidak memilik server_id, maka kosongkan saja Lihat Produk	String	Tidak
signature	Signature dengan formula md5(merchant_id:secret_key:ref_id)	String	Ya
Contoh
https://v1.apigames.id/v2/transaksi?ref_id=sdfs&merchant_id=M220718CYXXXXX3KFF&produk=ff5&tujuan=4645&signature=30d19bbcd6c9784c020b135c818e8291c00e1a3d12e143c7bb924492c1e57cfb&server_id
Response
Deskripsi
Contoh Response
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PENDING. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Pending",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Error
{
    "error_msg": "Signature not valid",
    "status": 0
}; Method POST
Melakukan pembelian produk menggunakan Metode POST melalui api versi 2

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi
HTTP Method
POST
Request
Deskripsi
Berikut adalah struktur JSON yang diharapkan:

Parameter	Deskripsi	Tipe Data	Wajib
ref_id	Ref ID unik Anda	String	Ya
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
produk	Kode Produk Bisa menggunakan prefix custom misalnya AGML80 untuk produk ML80	String	Ya
tujuan	Tujuan Pengisian	String	Ya
server_id	Isi string kosong "" jika produk tidak memiliki Server ID Lihat Produk	String	Ya
signature	Signature dengan formula md5(merchant_id:secret_key:ref_id)	String	Ya
Contoh
{
  "ref_id": "T220926XXXXX00003",
  "merchant_id": "M220718CYXXXXX3KFF",
  "produk": "ff5",
  "tujuan": "4645",
  "server_id": "",
  "signature": "fa375f4e3dsdbe2cdcf5d1ee0e9d678ad"
}
Response
Deskripsi
Contoh Response
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PENDING. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Pending",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Error
{
    "error_msg": "Signature not valid",
    "status": 0
}; IRS
Melakukan pembelian produk menggunakan Metode GET (versi 2) Khusus untuk software pulsa IRS bisa menggunakan jalur transaksi ini

warning
BACA KETENTUAN

danger
Khusus untuk IRS, response pertama kali yang di berikan adalah PROSES.

Endpoint
https://v1.apigames.id/v2/transaksi-irs?ref_id=[ref_id]&merchant_id=[merchant_id]&produk=[kode_produk]&tujuan=[tujuan]&secret=[secret]&server_id=
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
ref_id	Ref ID unik Anda	String	Ya
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
produk	Kode Produk Bisa menggunakan prefix custom misalnya AGML80 untuk produk ML80	String	Ya
tujuan	Tujuan Pengisian	String	Ya
server_id	Jika produk tidak memilik server_id, maka kosongkan saja Lihat Produk	String	Tidak
secret	Secret Key anda Lihat Pengaturan Secret Key	String	Ya
Contoh
https://v1.apigames.id/v2/transaksi-irs?ref_id=sdfsdx2x&merchant_id=M220718CYXXXXX3KFF&produk=ff5&tujuan=277286020&secret=30d19bbcd6c9784c020b135c818e8291c00e1a3d12e143c7bb924492c1e57cfb&server_id=
Response
Contoh Response
R#tes1 ff5.277286020, status PROSES. . Sisa saldo 99048600
Contoh Response Error
status ERROR. Signature not valid; Otomax
Melakukan pembelian produk menggunakan Metode GET (versi 2) Khusus untuk software pulsa otomax bisa menggunakan jalur transaksi ini

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi-otomax?ref_id=[ref_id]&merchant_id=[merchant_id]&produk=[kode_produk]&tujuan=[tujuan]&secret=[secret]&server_id=
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
ref_id	Ref ID unik Anda	String	Ya
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
produk	Kode Produk Bisa menggunakan prefix custom misalnya AGML80 untuk produk ML80	String	Ya
tujuan	Tujuan Pengisian	String	Ya
server_id	Jika produk tidak memilik server_id, maka kosongkan saja Lihat Produk	String	Tidak
secret	Secret Key anda Lihat Pengaturan Secret Key	String	Ya
Contoh
https://v1.apigames.id/v2/transaksi-otomax?ref_id=sdfsdx2x&merchant_id=M220718CYXXXXX3KFF&produk=ff5&tujuan=2772860208&secret=30d19bbcd6c9784c020b135c818e8291c00e1a3d12e143c7bb924492c1e57cfb&server_id=
Response
Contoh Response
R#122xxe334 ff5.2772860208, status PENDING. . Sisa saldo 99048650
Contoh Response Error
status ERROR. Signature not valid; Method GET
Pengecekan status transaksi versi 2

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi/status?merchant_id=[merchant_id]&ref_id=[ref_id]&signature=[signature]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
ref_id	Ref ID unik Anda	String	Ya
signature	Signature dengan formula md5(merchant_id:secret_key:ref_id)	String	Ya
Contoh
https://v1.apigames.id/v2/transaksi/status?merchant_id=M220718CYXXXXX3KFF&ref_id=sdfsdx2&signature=1db518e0c97adb24cddc77be3c806773
Response
Contoh Response Error
{
    "error_msg": "Signature not valid",
    "status": 0
}
Contoh Response Gagal
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status GAGAL. error_require_login. Sisa saldo 99049000",
        "status": "Gagal",
        "sn": "error_require_login",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Validasi Provider
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status VALIDASI PROVIDER. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Validasi Provider",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Sukses Sebagian
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status SUKSES SEBAGIAN. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Sukses Sebagian",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Proses
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PROSES. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Proses",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Pending
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PENDING. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Pending",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Sukses
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status SUKSES. SN/Ref: BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Sukses",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}; Method POST
Pengecekan status transaksi versi 2

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi/status
HTTP Method
POST
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
ref_id	Ref ID unik Anda	String	Ya
signature	Signature dengan formula md5(merchant_id:secret_key:ref_id)	String	Ya
Contoh Payload
{
  "ref_id": "TRX0007",
  "merchant_id": "M220718CYXXXXX3KFF",
  "signature": "fa375f4e30dbe2cdcf5d1ee0e9d678ad"
}

Response
Contoh Response Error
{
    "error_msg": "Signature not valid",
    "status": 0
}
Contoh Response Gagal
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status GAGAL. error_require_login. Sisa saldo 99049000",
        "status": "Gagal",
        "sn": "error_require_login",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Validasi Provider
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status VALIDASI PROVIDER. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Validasi Provider",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Sukses Sebagian
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status SUKSES SEBAGIAN. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Sukses Sebagian",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Proses
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PROSES. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Proses",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Pending
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status PENDING. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Pending",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}
Contoh Response Sukses
{
    "data": {
        "merchant_id": "M220718CYXXXXX3KFF",
        "trx_id": "T220926XXXXX00003",
        "ref_id": "sdfsdx2",
        "destination": "4645",
        "product_code": "ff5",
        "product_code_master": "ff5",
        "message": "R#sdfsdx2 ff5.4645, status SUKSES. SN/Ref: BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
        "status": "Sukses",
        "sn": "BSK.AFULP. RefId : 12067803053055289057",
        "last_balance": "99049000",
        "product_detail": {
            "name": "5 Diamond Free Fire",
            "code": "ff5",
            "price": 3,
            "price_unit": "garena shell",
            "rate": 250,
            "price_rp": 750
        }
    },
    "status": 1
}; HTTP TEXT / IP
Pengecekan status transaksi versi 2

warning
BACA KETENTUAN

Endpoint
https://v1.apigames.id/v2/transaksi/status-get-text?merchant_id=[merchant_id]&ref_id=[ref_id]&secret=[secret]
HTTP Method
GET
Request
Deskripsi
Berikut adalah parameter yang di harapkan

Parameter	Deskripsi	Tipe Data	Wajib
merchant_id	Merchant ID Anda Lihat Pengaturan Secret Key	String	Ya
ref_id	Ref ID unik Anda	String	Ya
secret	Secret Key Anda Lihat Pengaturan Secret Key	String	Ya
Contoh
https://v1.apigames.id/v2/transaksi/status-get-text?merchant_id=M220718CYXXXXX3KFF&ref_id=sdfsdx2&secret=30d19bbcd6c9784c020b135c818e8291c00e1a3d12e143c7bb924492c1e57cfb
Response
Contoh Response Error
status ERROR. Signature not valid
Contoh Response Gagal
R#sdfsdx2 ff5.4645, status GAGAL. error_require_login. Sisa saldo 99049000
Contoh Response Validasi Provider
R#sdfsdx2 ff5.4645, status VALIDASI PROVIDER. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000
Contoh Response Sukses Sebagian
R#sdfsdx2 ff5.4645, status SUKSES SEBAGIAN. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000
Contoh Response Proses
R#sdfsdx2 ff5.4645, status PROSES. BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000
Contoh Response Pending
R#sdfsdx2 ff5.4645, status PENDING. . Sisa saldo 99049000
Contoh Response Sukses
R#sdfsdx2 ff5.4645, status SUKSES. SN/Ref: BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000; Trx via GET/POST
info
Ini merupakan sample webhook yang kami kirimkan kepada anda jika menggunakan transaksi melalui metode POST / GET

info
Kami akan mengirimkan report ke webhook anda setiap ada perubahan status transaksi Pastikan untuk Whitelist IP Kami : 157.245.207.5

Header
Header yang kami kirimkan dengan Key X-Apigames-Authorization dan value dengan Formula md5(merchant_id:secret_key:ref_id) :

"X-Apigames-Authorization": "bd134207f74532a8b094676c4a2ca9ed" //md5(merchant_id:secret_key:ref_id)
Sample
Sample Webhook Sukses
{
  "merchant_id": "M220718CYXXXXX3KFF",
  "trx_id": "T220926XXXXX00003",
  "ref_id": "sdfsdx2",
  "destination": "4645",
  "product_code": "ff5",
  "product_code_master": "ff5",
  "message": "R#sdfsdx2 ff5.4645, status SUKSES. SN/Ref: BSK.AFULP. RefId : 12067803053055289057. Sisa saldo 99049000",
  "status": "Sukses",
  "sn": "BSK.AFULP. RefId : 12067803053055289057",
  "last_balance": "99049000",
  "product_detail": {
    "name": "5 Diamond Free Fire",
    "code": "ff5",
    "price": 3,
    "price_unit": "garena shell",
    "rate": 250,
    "price_rp": 750
  }
}
Sample Webhook Gagal
{
  "merchant_id": "M220718CYXXXXX3KFF",
  "trx_id": "T220927DVXS000006",
  "ref_id": "122xxe3322221",
  "destination": "2772860208223211111",
  "product_code": "ff5",
  "product_code_master": "ff5",
  "message": "R#122xxe3322221 ff5.2772860208223211111, status GAGAL. error_require_login. Sisa saldo 99048675",
  "status": "Gagal",
  "sn": "error_require_login",
  "last_balance": "99048675",
  "product_detail": {
    "name": "5 Diamond Free Fire",
    "code": "ff5",
    "price": 3,
    "price_unit": "garena shell",
    "rate": 250,
    "price_rp": 750
  }
}; Trx via Otomax / IRS
info
Kami akan mengirimkan report kepada anda setiap ada perubahan status transaksi Pastikan untuk Whitelist IP Kami :157.245.207.5Tokovoucher akan mengirimkan balasan SUKSES / GAGAL ke url Anda dengan format sebagai berikut:

Sample
Sample Report Sukses
https://url-mitra.com/report?serverid=T220926XXXXX00003&clientid=122xxe3322221&statuscode=1&kp=ff5&msisdn=4645&sn=BSK%2CAFULP%2C%20RefId%20%3A%2012067803053055289057&msg=R%23sdfsdx2%20ff5.4645%2C%20status%20SUKSES.%20SN%2FRef%3A%20BSK.AFULP.%20RefId%20%3A%2012067803053055289057.%20Sisa%20saldo%2099049000
Sample Report Gagal
https://url-mitra.com/report?serverid=T220926XXXXX00003&clientid=122xxe3322221&statuscode=2&kp=ff5&msisdn=2772860208223211111&sn=error_require_login&msg=R%23122xxe3322221%20ff5.2772860208223211111%2C%20status%20GAGAL.%20error_require_login.%20Sisa%20saldo%2099048675
