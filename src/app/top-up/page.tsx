"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, Wallet, Smartphone, Wifi, Zap, 
  Tv, Ticket, ArrowRight, ShieldCheck, 
  Clock, Tag, ChevronDown, Repeat 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Dummy Data
const QUICK_ACCESS = [
  { icon: Wallet, title: "E-Wallet", desc: "DANA, OVO, GoPay", href: "/top-up/e-wallet" },
  { icon: Smartphone, title: "Pulsa", desc: "Telkomsel, Indosat", href: "/top-up/pulsa" },
  { icon: Wifi, title: "Paket Data", desc: "Internet Kuota", href: "/top-up/data" },
  { icon: Zap, title: "PLN", desc: "Token Listrik", href: "/top-up/pln" },
  { icon: Tv, title: "Subscription", desc: "Netflix, Spotify", href: "/top-up/subscription" },
  { icon: Ticket, title: "Voucher", desc: "Google Play, Steam", href: "/top-up/voucher" },
];

const POPULAR_SERVICES = [
  { title: "DANA Top Up", desc: "Mulai dari Rp 10.000" },
  { title: "Telkomsel Data", desc: "Internet Sakti 15GB" },
  { title: "Netflix Premium", desc: "1 Bulan 4K UHD" },
  { title: "Steam Wallet", desc: "IDR 50.000" },
];

const PAYMENT_METHODS = [
  "DANA", "OVO", "GoPay", "ShopeePay", "BCA", "Mandiri", "BNI", "BRI", "Alfamart", "Indomaret", "QRIS"
];

const WHY_US = [
  { icon: Zap, title: "Instant Delivery", desc: "Proses masuk dalam hitungan detik." },
  { icon: ShieldCheck, title: "Secure Transactions", desc: "100% aman dengan enkripsi bank." },
  { icon: Clock, title: "24/7 Support", desc: "Layanan pelanggan siap membantu kapan saja." },
  { icon: Tag, title: "Competitive Prices", desc: "Harga termurah & banyak promo menarik." },
];

const FAQS = [
  { q: "Berapa lama proses top up?", a: "Proses otomatis 1-5 detik setelah pembayaran berhasil." },
  { q: "Apakah aman?", a: "Tentu! Transaksi kami dienkripsi dan 100% terjamin keamanannya." },
  { q: "Bisa refund?", a: "Bisa, jika pesanan gagal dari sistem kami, saldo akan dikembalikan 100%." },
];

export default function TopUpPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] texture-overlay py-12 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute left-4 top-20 bottom-20 w-8 border-l-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block pointer-events-none" />
      <div className="absolute right-4 top-20 bottom-20 w-8 border-r-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10 space-y-24">
        
        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-5xl sm:text-6xl font-bold text-[var(--color-navy)] mb-4 leading-tight"
            >
              Top Up & <br />
              <span className="text-[var(--color-teal)]">Digital Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--color-teal)]/80 mb-8"
            >
              Semua kebutuhan digital dalam satu tempat.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative w-full max-w-xl mb-8"
            >
              <div className="relative flex items-center w-full h-16 rounded-[20px] bg-white border border-[#0F3D4A]/20 shadow-[0_10px_30px_-10px_rgba(8,59,76,0.1)] overflow-hidden">
                <Search className="absolute left-5 h-6 w-6 text-[var(--color-teal)]/50" />
                <input 
                  type="text" 
                  placeholder="Cari pulsa, e-wallet, subscription..." 
                  className="w-full h-full pl-14 pr-4 bg-transparent outline-none text-[var(--color-navy)] placeholder:text-[var(--color-teal)]/40 font-medium"
                />
                <Button className="h-full rounded-none rounded-r-[20px] px-8 bg-[var(--color-teal)] hover:bg-[var(--color-navy)] transition-colors text-white font-semibold">
                  Cari
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 text-sm font-medium text-[var(--color-teal)]/70">
                <span>Sugesti:</span>
                {["DANA", "Telkomsel", "Netflix", "Steam Wallet"].map((tag) => (
                  <span key={tag} className="hover:text-[var(--color-navy)] cursor-pointer transition-colors border-b border-transparent hover:border-[var(--color-navy)]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative h-[400px] flex items-center justify-center"
          >
            {/* Abstract Premium Fintech Illustration */}
            <div className="absolute w-[300px] h-[400px] bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-navy)] rounded-[40px] rotate-6 shadow-[0_20px_50px_rgba(11,29,52,0.2)] opacity-10" />
            
            {/* Floating Cards */}
            <div className="relative w-[300px] h-[180px] bg-white rounded-[24px] border border-[#0F3D4A]/10 shadow-[0_20px_40px_rgba(11,29,52,0.1)] p-6 z-10 -rotate-3 animate-float overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-center mb-8">
                <Wallet className="h-8 w-8 text-[var(--color-teal)]" />
                <div className="h-8 w-12 bg-gray-100 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full" />
                <div className="h-4 w-48 bg-[var(--color-navy)] rounded-full" />
              </div>
            </div>
            
            <div className="absolute bottom-10 right-10 w-[240px] h-[120px] bg-[var(--color-cream)] rounded-[20px] border border-[var(--color-gold)]/30 shadow-[0_15px_30px_rgba(247,200,115,0.2)] p-4 z-20 rotate-6 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-[var(--color-teal)] rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="h-3 w-20 bg-[var(--color-teal)]/80 rounded-full mb-1" />
                  <div className="h-2 w-16 bg-[var(--color-teal)]/40 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. QUICK ACCESS GRID */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Layanan Digital</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {QUICK_ACCESS.map((item, idx) => (
              <Link key={item.title} href={item.href}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[24px] p-6 border border-[#0F3D4A]/10 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(8,59,76,0.15)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-2xl bg-[var(--color-cream)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-teal)] group-hover:text-white text-[var(--color-teal)] transition-colors border border-[var(--color-gold)]/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[var(--color-navy)] mb-1 group-hover:text-[var(--color-teal)] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[var(--color-teal)]/70 font-medium">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. PROMO BANNERS */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-[var(--color-teal)] rounded-[32px] p-8 sm:p-12 overflow-hidden relative flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
          >
            {/* BG Decoration */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
              <div className="absolute right-[-10%] top-[-20%] w-96 h-96 rounded-full bg-[var(--color-gold)] blur-[80px]" />
            </div>
            
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-xs uppercase tracking-wider mb-4">
                Promo Spesial
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Cashback 20% <br />
                Top Up DANA
              </h2>
              <p className="text-lg text-white/80 mb-8 font-medium">
                Gunakan kode promo: <span className="text-[var(--color-gold)] font-bold">DANAMIQ</span>. Berlaku hingga akhir bulan ini!
              </p>
              <Button size="lg" className="bg-white text-[var(--color-teal)] hover:bg-[var(--color-cream)] rounded-full h-14 px-8 font-bold text-lg shadow-lg">
                Klaim Sekarang
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 4. POPULAR SERVICES */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Populer Hari Ini</h2>
            <Link href="#" className="text-[var(--color-teal)] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 snap-x hide-scrollbar">
            {POPULAR_SERVICES.map((service, idx) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="shrink-0 w-[280px] bg-white rounded-[24px] p-5 border border-[#0F3D4A]/10 shadow-sm snap-start hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-12 w-12 rounded-full bg-[var(--color-cream)] flex items-center justify-center mb-4 text-[var(--color-teal)]">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--color-navy)] mb-1">{service.title}</h3>
                <p className="text-sm text-[var(--color-teal)]/70 font-medium mb-6">{service.desc}</p>
                <Button className="mt-auto w-full bg-[var(--color-cream)] text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white rounded-xl font-semibold transition-colors">
                  Top Up
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. RECENT TRANSACTIONS (Logged In State Mockup) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Transaksi Terakhir</h2>
          </div>
          <div className="bg-white rounded-[24px] border border-[#0F3D4A]/10 shadow-sm overflow-hidden p-2">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 hover:bg-[var(--color-cream)]/50 rounded-[20px] transition-colors border-b border-[#0F3D4A]/5 last:border-0 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)]">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-navy)] text-lg">Telkomsel 25GB</h4>
                    <p className="text-sm text-[var(--color-teal)]/70">Hari ini, 14:30 WIB</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Berhasil</span>
                  <Button variant="outline" size="sm" className="rounded-full border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Beli Lagi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. WHY CHOOSE US */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-navy)] mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-[var(--color-teal)]/80 max-w-2xl mx-auto">Kami memberikan layanan terbaik dengan sistem otomatis yang cepat, aman, dan terpercaya.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, idx) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-transparent text-center flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-[var(--color-teal)] mb-6 shadow-sm border border-[var(--color-gold)]/20">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[var(--color-navy)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-teal)]/80 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. PAYMENT METHODS LOGO WALL */}
        <section className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#0F3D4A]/10 shadow-sm text-center">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-navy)] mb-8">Metode Pembayaran Lengkap</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {PAYMENT_METHODS.map((method) => (
              <div key={method} className="px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold text-gray-400 text-lg">
                {method}
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="max-w-3xl mx-auto pb-12">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-navy)]">Pertanyaan Populer</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-[20px] border border-[#0F3D4A]/10 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-[var(--color-navy)] font-heading font-bold text-lg">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-[var(--color-teal)] transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-[var(--color-teal)]/80 font-medium">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
