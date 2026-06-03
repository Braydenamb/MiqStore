import {
  Gamepad2,
  Smartphone,
  CreditCard,
  Wallet,
  Zap,
  Receipt,
  Wifi,
  Tv,
  type LucideIcon,
} from "lucide-react";

/* ============================================
   App Constants
   ============================================ */

export const APP_NAME = "MiqStore";
export const APP_DESCRIPTION =
  "TopUp game, voucher digital, pulsa & paket data dengan harga termurah dan proses tercepat. Transaksi aman & otomatis 24 jam.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/* ---------- Navigation ---------- */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Voucher", href: "/voucher" },
  { label: "Pulsa", href: "/pulsa" },
  { label: "E-Wallet", href: "/e-wallet" },
  { label: "PPOB", href: "/ppob" },
] as const;

/* ---------- Product Categories ---------- */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "game-topup",
    name: "Game TopUp",
    slug: "game-topup",
    description: "Top up diamond, UC, dan item game favorit",
    icon: Gamepad2,
    color: "text-purple-400",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "voucher",
    name: "Voucher",
    slug: "voucher",
    description: "Voucher game, streaming, dan digital lainnya",
    icon: CreditCard,
    color: "text-cyan-400",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "pulsa",
    name: "Pulsa & Data",
    slug: "pulsa",
    description: "Isi pulsa dan paket data semua operator",
    icon: Smartphone,
    color: "text-green-400",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    slug: "e-wallet",
    description: "Top up saldo GoPay, OVO, DANA, ShopeePay",
    icon: Wallet,
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "token-listrik",
    name: "Token Listrik",
    slug: "token-listrik",
    description: "Beli token listrik PLN prabayar",
    icon: Zap,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    id: "ppob",
    name: "PPOB",
    slug: "ppob",
    description: "Bayar tagihan bulanan online",
    icon: Receipt,
    color: "text-pink-400",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "paket-data",
    name: "Paket Data",
    slug: "paket-data",
    description: "Paket internet murah semua operator",
    icon: Wifi,
    color: "text-blue-400",
    gradient: "from-blue-500 to-sky-600",
  },
  {
    id: "streaming",
    name: "Streaming",
    slug: "streaming",
    description: "Voucher Netflix, Spotify, Disney+, dll",
    icon: Tv,
    color: "text-red-400",
    gradient: "from-red-500 to-rose-600",
  },
];

/* ---------- Popular Games ---------- */
export interface Game {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: "mobile" | "pc" | "console";
  image: string;
  banner: string;
  color: string;
  fields: GameField[];
  popular: boolean;
}

export interface GameField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
}

export const POPULAR_GAMES: Game[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    slug: "mobile-legends",
    publisher: "Moonton",
    category: "mobile",
    image: "/images/mobile-legends.jpg",
    banner: "/images/mobile-legends.jpg",
    color: "#1a56db",
    fields: [
      { key: "user_id", label: "User ID", placeholder: "Masukkan User ID", type: "text" },
      { key: "zone_id", label: "Zone ID", placeholder: "Masukkan Zone ID", type: "text" },
    ],
    popular: true,
  },
  {
    id: "free-fire",
    name: "Free Fire",
    slug: "free-fire",
    publisher: "Garena",
    category: "mobile",
    image: "/images/free-fire.webp",
    banner: "/images/free-fire.webp",
    color: "#ff5722",
    fields: [
      { key: "user_id", label: "User ID", placeholder: "Masukkan User ID", type: "text" },
    ],
    popular: true,
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    publisher: "Tencent",
    category: "mobile",
    image: "/images/pubg-mobile.jpg",
    banner: "/images/pubg-mobile.jpg",
    color: "#f5a623",
    fields: [
      { key: "user_id", label: "Player ID", placeholder: "Masukkan Player ID", type: "text" },
    ],
    popular: true,
  },
  {
    id: "valorant",
    name: "Valorant",
    slug: "valorant",
    publisher: "Riot Games",
    category: "pc",
    image: "/images/valorant.jpg",
    banner: "/images/valorant.jpg",
    color: "#ff4655",
    fields: [
      { key: "riot_id", label: "Riot ID", placeholder: "Nama#TAG", type: "text" },
    ],
    popular: true,
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    slug: "genshin-impact",
    publisher: "miHoYo",
    category: "pc",
    image: "/images/genshin-impact.jpg",
    banner: "/images/genshin-impact.jpg",
    color: "#5b8cff",
    fields: [
      { key: "user_id", label: "UID", placeholder: "Masukkan UID", type: "text" },
      {
        key: "server",
        label: "Server",
        placeholder: "Pilih Server",
        type: "select",
        options: [
          { value: "asia", label: "Asia" },
          { value: "america", label: "America" },
          { value: "europe", label: "Europe" },
          { value: "sar", label: "TW/HK/MO" },
        ],
      },
    ],
    popular: true,
  },
  {
    id: "honkai-star-rail",
    name: "Honkai: Star Rail",
    slug: "honkai-star-rail",
    publisher: "miHoYo",
    category: "pc",
    image: "/images/honkai-star-rail.png",
    banner: "/images/honkai-star-rail.png",
    color: "#a855f7",
    fields: [
      { key: "user_id", label: "UID", placeholder: "Masukkan UID", type: "text" },
      {
        key: "server",
        label: "Server",
        placeholder: "Pilih Server",
        type: "select",
        options: [
          { value: "asia", label: "Production-Asia" },
          { value: "america", label: "Production-NA" },
          { value: "europe", label: "Production-EU" },
          { value: "sar", label: "Production-SAR" },
        ],
      },
    ],
    popular: true,
  },
  {
    id: "roblox",
    name: "Roblox",
    slug: "roblox",
    publisher: "Roblox Corp",
    category: "pc",
    image: "/images/roblox.jpg",
    banner: "/images/roblox.jpg",
    color: "#e2231a",
    fields: [
      { key: "username", label: "Username", placeholder: "Masukkan Username", type: "text" },
    ],
    popular: true,
  },
  {
    id: "steam-wallet",
    name: "Steam Wallet",
    slug: "steam-wallet",
    publisher: "Valve",
    category: "pc",
    image: "/images/steam-wallet.png",
    banner: "/images/steam-wallet.png",
    color: "#171a21",
    fields: [],
    popular: true,
  },
];

/* ---------- Payment Methods ---------- */
export interface PaymentMethod {
  id: string;
  name: string;
  category: "e-wallet" | "virtual-account" | "qris" | "retail" | "credit-card";
  icon: string;
  fee: number;
  feeType: "flat" | "percent";
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", name: "QRIS", category: "qris", icon: "/payments/qris.svg", fee: 0.7, feeType: "percent" },
  { id: "gopay", name: "GoPay", category: "e-wallet", icon: "/payments/gopay.svg", fee: 0, feeType: "flat" },
  { id: "ovo", name: "OVO", category: "e-wallet", icon: "/payments/ovo.svg", fee: 0, feeType: "flat" },
  { id: "dana", name: "DANA", category: "e-wallet", icon: "/payments/dana.svg", fee: 0, feeType: "flat" },
  { id: "shopeepay", name: "ShopeePay", category: "e-wallet", icon: "/payments/shopeepay.svg", fee: 0, feeType: "flat" },
  { id: "bca-va", name: "BCA Virtual Account", category: "virtual-account", icon: "/payments/bca.svg", fee: 4000, feeType: "flat" },
  { id: "bni-va", name: "BNI Virtual Account", category: "virtual-account", icon: "/payments/bni.svg", fee: 4000, feeType: "flat" },
  { id: "bri-va", name: "BRI Virtual Account", category: "virtual-account", icon: "/payments/bri.svg", fee: 4000, feeType: "flat" },
  { id: "mandiri-va", name: "Mandiri Virtual Account", category: "virtual-account", icon: "/payments/mandiri.svg", fee: 4000, feeType: "flat" },
  { id: "indomaret", name: "Indomaret", category: "retail", icon: "/payments/indomaret.svg", fee: 2500, feeType: "flat" },
  { id: "alfamart", name: "Alfamart", category: "retail", icon: "/payments/alfamart.svg", fee: 2500, feeType: "flat" },
];

/* ---------- Stats ---------- */
export const STATS = [
  { label: "Transaksi Sukses", value: 2500000, suffix: "+" },
  { label: "Pengguna Aktif", value: 850000, suffix: "+" },
  { label: "Produk Tersedia", value: 500, suffix: "+" },
  { label: "Uptime", value: 99.9, suffix: "%" },
] as const;

/* ---------- Testimonials ---------- */
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  game: string;
  rating: number;
  comment: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Rizky Pratama",
    avatar: "/avatars/user1.webp",
    game: "Mobile Legends",
    rating: 5,
    comment: "Diamond langsung masuk dalam hitungan detik! Harga termurah dan proses super cepat. Recommended banget!",
    date: "2026-05-15",
  },
  {
    id: "2",
    name: "Sarah Aulia",
    avatar: "/avatars/user2.webp",
    game: "Genshin Impact",
    rating: 5,
    comment: "Top up Genesis Crystal di sini paling murah. Proses otomatis dan CS responsif. Udah langganan dari lama!",
    date: "2026-05-18",
  },
  {
    id: "3",
    name: "Ahmad Fauzi",
    avatar: "/avatars/user3.webp",
    game: "Free Fire",
    rating: 4,
    comment: "Pelayanan cepat dan harga bersaing. Cuma kadang pas jam ramai agak lambat, tapi overall oke banget!",
    date: "2026-05-20",
  },
  {
    id: "4",
    name: "Dewi Anggraini",
    avatar: "/avatars/user4.webp",
    game: "Valorant",
    rating: 5,
    comment: "VP langsung masuk, ga perlu nunggu lama. Metode pembayaran lengkap, bisa pake QRIS juga. Top!",
    date: "2026-05-22",
  },
  {
    id: "5",
    name: "Budi Santoso",
    avatar: "/avatars/user5.webp",
    game: "PUBG Mobile",
    rating: 5,
    comment: "Sudah beli UC berkali-kali di sini. Selalu lancar dan harga paling murah dibanding yang lain. Mantap!",
    date: "2026-05-24",
  },
  {
    id: "6",
    name: "Maya Indah",
    avatar: "/avatars/user6.webp",
    game: "Honkai: Star Rail",
    rating: 5,
    comment: "Beli Oneiric Shard di sini aja. Proses cepat, ada promo member juga. Suka banget!",
    date: "2026-05-25",
  },
];

/* ---------- FAQ ---------- */
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Bagaimana cara melakukan top up?",
    answer:
      "Pilih game yang ingin di top up, masukkan User ID/Player ID, pilih nominal yang diinginkan, pilih metode pembayaran, lalu selesaikan pembayaran. Diamond/item akan otomatis masuk ke akun game kamu.",
  },
  {
    question: "Berapa lama proses top up?",
    answer:
      "Proses top up biasanya memakan waktu 1-5 menit setelah pembayaran dikonfirmasi. Untuk beberapa produk tertentu bisa memakan waktu hingga 15 menit di jam sibuk.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menyediakan berbagai metode pembayaran termasuk QRIS, E-Wallet (GoPay, OVO, DANA, ShopeePay), Virtual Account (BCA, BNI, BRI, Mandiri), dan gerai retail (Indomaret, Alfamart).",
  },
  {
    question: "Apakah aman bertransaksi di MiqStore?",
    answer:
      "Ya, sangat aman! Kami menggunakan enkripsi SSL, payment gateway resmi (Midtrans & Xendit), dan sistem keamanan berlapis untuk melindungi data dan transaksi kamu.",
  },
  {
    question: "Bagaimana jika top up gagal atau item tidak masuk?",
    answer:
      "Jika terjadi kegagalan, dana akan otomatis dikembalikan (refund) dalam 1x24 jam. Kamu juga bisa menghubungi customer service kami melalui WhatsApp atau Live Chat.",
  },
  {
    question: "Apakah ada program membership atau diskon?",
    answer:
      "Ya! Kami memiliki program membership dengan 4 tier: Bronze, Silver, Gold, dan Diamond. Setiap tier memberikan cashback dan diskon khusus. Semakin banyak transaksi, semakin besar benefitnya!",
  },
];

/* ---------- Promo Banners ---------- */
export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
  badge?: string;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "1",
    title: "Flash Sale Mobile Legends",
    subtitle: "Diskon hingga 20% untuk semua nominal diamond. Terbatas!",
    cta: "TopUp Sekarang",
    href: "/games/mobile-legends",
    gradient: "from-blue-600 via-indigo-700 to-purple-800",
    badge: "FLASH SALE",
  },
  {
    id: "2",
    title: "Bonus 10% Genshin Impact",
    subtitle: "Top up Genesis Crystal dan dapatkan bonus 10% extra. Promo terbatas!",
    cta: "Klaim Bonus",
    href: "/games/genshin-impact",
    gradient: "from-amber-500 via-orange-600 to-red-700",
    badge: "HOT DEAL",
  },
  {
    id: "3",
    title: "Cashback E-Wallet 5%",
    subtitle: "Bayar dengan GoPay, OVO, atau DANA dan nikmati cashback 5% setiap transaksi.",
    cta: "Mulai Belanja",
    href: "/games",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    badge: "CASHBACK",
  },
];

/* ---------- Products ---------- */
export interface ProductItem {
  id: string;
  name: string;
  amount: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
}

export const GAME_PRODUCTS: Record<string, ProductItem[]> = {
  "mobile-legends": [
    { id: "ml-86", name: "86 Diamonds", amount: 86, price: 18500 },
    { id: "ml-172", name: "172 Diamonds", amount: 172, price: 36000 },
    { id: "ml-257", name: "257 Diamonds", amount: 257, price: 52000 },
    { id: "ml-344", name: "344 Diamonds", amount: 344, price: 68000, popular: true },
    { id: "ml-429", name: "429 Diamonds", amount: 429, price: 84000 },
    { id: "ml-514", name: "514 Diamonds", amount: 514, price: 99000 },
    { id: "ml-706", name: "706 Diamonds", amount: 706, price: 135000, popular: true },
    { id: "ml-878", name: "878 Diamonds", amount: 878, price: 168000 },
    { id: "ml-1050", name: "1050 Diamonds", amount: 1050, price: 199000 },
    { id: "ml-2010", name: "2010 Diamonds", amount: 2010, price: 375000 },
    { id: "ml-4805", name: "4805 Diamonds", amount: 4805, price: 850000 },
    { id: "ml-starlight", name: "Starlight Member", amount: 1, price: 149000, originalPrice: 159000 },
  ],
  "free-fire": [
    { id: "ff-70", name: "70 Diamonds", amount: 70, price: 14000 },
    { id: "ff-140", name: "140 Diamonds", amount: 140, price: 27000 },
    { id: "ff-355", name: "355 Diamonds", amount: 355, price: 65000, popular: true },
    { id: "ff-720", name: "720 Diamonds", amount: 720, price: 130000 },
    { id: "ff-1450", name: "1450 Diamonds", amount: 1450, price: 255000 },
    { id: "ff-membership", name: "Weekly Membership", amount: 1, price: 29000 },
  ],
  "genshin-impact": [
    { id: "gi-60", name: "60 Genesis Crystals", amount: 60, price: 16000 },
    { id: "gi-300", name: "300+30 Genesis Crystals", amount: 330, price: 79000 },
    { id: "gi-980", name: "980+110 Genesis Crystals", amount: 1090, price: 249000, popular: true },
    { id: "gi-1980", name: "1980+260 Genesis Crystals", amount: 2240, price: 479000 },
    { id: "gi-3280", name: "3280+600 Genesis Crystals", amount: 3880, price: 799000 },
    { id: "gi-6480", name: "6480+1600 Genesis Crystals", amount: 8080, price: 1599000 },
    { id: "gi-blessing", name: "Blessing of the Welkin Moon", amount: 1, price: 79000, popular: true },
  ],
  "valorant": [
    { id: "vl-125", name: "125 VP", amount: 125, price: 15000 },
    { id: "vl-420", name: "420 VP", amount: 420, price: 49000 },
    { id: "vl-700", name: "700 VP", amount: 700, price: 79000, popular: true },
    { id: "vl-1375", name: "1375 VP", amount: 1375, price: 149000 },
    { id: "vl-2400", name: "2400 VP", amount: 2400, price: 249000 },
    { id: "vl-4000", name: "4000 VP", amount: 4000, price: 399000 },
    { id: "vl-8150", name: "8150 VP", amount: 8150, price: 799000 },
  ],
};

export const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: "def-1", name: "Paket 1", amount: 100, price: 15000 },
  { id: "def-2", name: "Paket 2", amount: 300, price: 45000 },
  { id: "def-3", name: "Paket 3", amount: 500, price: 75000, popular: true },
  { id: "def-4", name: "Paket 4", amount: 1000, price: 150000 },
];
