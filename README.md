# MiqStore 🎮
**The Next-Generation Game Top-up & Digital Ecosystem**

MiqStore is an ultra-modern, highly scalable, event-driven e-commerce platform dedicated to digital game top-ups, voucher distribution, and reseller ecosystems. Built with the "Liquid Cyber Pastel" design language, it bridges the gap between stunning aesthetic experiences and hardcore enterprise backend architecture.

![MiqStore Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)

---

## ✨ Key Features

### 1. Liquid Glass Aesthetics
A cutting-edge UI featuring glassmorphism, dynamic gradients, smooth micro-animations, and hyper-responsive layouts. The platform uses Aceternity UI, Magic UI, and Framer Motion to instantly WOW users and build trust through premium visual fidelity.

### 2. Multi-Provider Smart Routing 🚦
Never run out of stock. MiqStore features a dynamic routing engine that tests multiple backend providers (e.g., Apigames, Digiflazz, VIP Reseller) in parallel.
- **Stock Validation**: Automatically falls back if a provider is out of stock.
- **Price Optimization**: Dynamically selects the cheapest provider to maximize profit margins.

### 3. AI Risk Engine & Personalization 🧠
- **Risk Engine**: Heuristic velocity and anomaly checks block suspicious transactions before they hit payment gateways.
- **Churn Predictor**: Automatically identifies users slipping away and mints custom retention Promo Codes to win them back.

### 4. Enterprise Telemetry 📊
Fully observable infrastructure. Blind `console.log` statements are replaced with a centralized Telemetry SDK that outputs JSON-structured logs for Grafana Loki, performance span tracking, and Prometheus metric counters.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Framer Motion
- **Image & Asset Management**: Cloudinary (`next-cloudinary`)
- **Package Manager**: pnpm
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker (Local DBs & Deployment)
- **Testing**: Playwright (E2E Validation) & Vitest (Unit)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- Docker (for local PostgreSQL instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Braydenamb/MiqStore.git
   cd MiqStore
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your keys.

4. **Initialize Database:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   pnpm dev
   ```

---

## 🤖 Developer & Agent Workflow

Modern AI coding agents (and human developers) must follow our **7-Phase Structured Roadmap** when undertaking major refactoring or feature implementation:

1. **Analyze project structure**
2. **Generate improvement roadmap** (Implementation Plan)
3. **Redesign / Implement UI and Logic**
4. **Improve performance**
5. **Add tests** (Playwright/Vitest)
6. **Prepare Vercel deployment**
7. **Generate documentation**

For detailed AI Agent configurations, please refer to the `AGENTS.md` and `RULES.md` files at the root of this project.
