# MiqStore 🎮
**The Next-Generation Game Top-up & Digital Ecosystem**

MiqStore is an ultra-modern, highly scalable, event-driven e-commerce platform dedicated to digital game top-ups, voucher distribution, and reseller ecosystems. Built with the "Liquid Glass" design language, it bridges the gap between stunning aesthetic experiences and hardcore enterprise backend architecture.

![MiqStore Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)

---

## ✨ Key Features

### 1. Liquid Glass Aesthetics
A cutting-edge UI featuring glassmorphism, dynamic gradients, smooth micro-animations, and hyper-responsive layouts. The platform is designed to instantly WOW users and build trust through premium visual fidelity.

### 2. Multi-Provider Smart Routing 🚦
Never run out of stock. MiqStore features a dynamic routing engine that tests multiple backend providers (e.g., Apigames, Digiflazz, VIP Reseller) in parallel.
- **Stock Validation**: Automatically falls back if a provider is out of stock.
- **Price Optimization**: Dynamically selects the cheapest provider to maximize profit margins.
- **Latency Protection**: Sequential ping tests ensure slow APIs are skipped instantly.

### 3. AI Risk Engine & Personalization 🧠
MiqStore actively defends itself and retains its users autonomously.
- **Risk Engine**: Heuristic velocity and anomaly checks block suspicious transactions before they hit payment gateways.
- **Churn Predictor**: Automatically identifies users slipping away and mints custom retention Promo Codes to win them back.

### 4. Gamification & Loyalty (XP System) 🏆
An internal RPG-like leveling system. Users earn XP for every transaction, climbing through tiers (BRONZE, SILVER, GOLD, PLATINUM, VIP). Higher tiers unlock automated Wallet Cashback percentages on every purchase.

### 5. Creator Affiliate System 🤝
A built-in affiliate network. Influencers and creators can generate custom referral links. The system tracks down-line conversions and auto-credits the creator's wallet with a configured percentage of the sale (e.g., 0.5% Lifetime Revenue Share).

### 6. Event-Driven Architecture ⚡
Built for insane scale. The orchestrator publishes events (e.g., `TRANSACTION_COMPLETED`) to a central Event Bus. Background workers independently calculate XP, distribute Cashback, and credit Affiliates asynchronously, ensuring lightning-fast API responses.

### 7. Enterprise Telemetry 📊
Fully observable infrastructure. Blind `console.log` statements are replaced with a centralized Telemetry SDK that outputs JSON-structured logs for Grafana Loki, performance span tracking, and Prometheus metric counters.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: NextAuth.js
- **Payments**: Midtrans Payment Gateway
- **Observability**: Custom Telemetry SDK (Prometheus/Loki/Sentry ready)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL Server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Braydenamb/MiqStore.git
   cd MiqStore
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your keys.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/miqstore"
   NEXTAUTH_SECRET="your-secret-key"
   MIDTRANS_SERVER_KEY="your-midtrans-key"
   APIGAMES_SECRET="your-apigames-key"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will be available at [http://localhost:3000](http://localhost:3000).*

---

## 🏗 Architecture Documentation
For an in-depth breakdown of the Event Bus, Smart Router, and AI components, please refer to the [ARCHITECTURE.md](./ARCHITECTURE.md).
