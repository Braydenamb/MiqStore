# MiqStore Architecture

This document serves as the technical blueprint for the MiqStore ecosystem. It explains the design decisions, patterns, and workflows that allow the platform to scale cleanly.

---

## 1. The Core Orchestrator (`transaction.ts`)

The transaction service is the heart of the application. It maps the lifecycle of an order from Intent -> Payment -> Delivery -> Post-Purchase Rewards.

### Decoupled Workflow (Event-Driven)
To prevent the main API thread from blocking, MiqStore utilizes a pub/sub `EventBus`.

1. **User requests Top-up**: The Risk Engine verifies the user isn't spamming.
2. **Payment Success**: Midtrans webhook triggers `processTopup`.
3. **Smart Routing**: The order is delegated to the `Provider Router`.
4. **Completion**: If top-up is successful, the orchestrator publishes `TRANSACTION_COMPLETED` to the Event Bus and immediately returns a `200 OK`.
5. **Background Workers**: Independent subscribers (`subscribers.ts`) catch the event and run `distributeCashback`, `awardTransactionXP`, and `distributeAffiliateCommission` in parallel.

---

## 2. Multi-Provider Router (`provider-router.ts`)

Instead of hardcoding a single provider (e.g., Apigames), the system acts as an aggregator to ensure 99.9% uptime and maximum profit.

### The Algorithm
When a top-up is requested, the Router executes the following Strategy Pattern:
1. **Parallel Stock Check**: It queries all registered providers (`ApigamesAdapter`, `DigiflazzAdapter`, `VipResellerAdapter`) simultaneously. Providers out of stock are instantly dropped.
2. **Price Sorting**: The remaining providers are sorted by their wholesale price (lowest first).
3. **Latency Ping**: The router attempts to ping the cheapest provider. If the latency is > 2000ms, it is deemed unhealthy, and the router gracefully falls back to the next cheapest provider.
4. **Execution**: The order is executed on the winning provider.

---

## 3. Heuristic AI Brain (`ai-brain.ts`)

MiqStore runs real-time algorithmic checks without the overhead of heavy Machine Learning models (e.g., TensorFlow).

### Risk Engine
- Tracks transaction velocity via Prisma.
- If a user attempts > 3 transactions in a rolling 10-minute window, their `FraudScore` spikes.
- At `Score > 80`, the orchestrator throws a `SecurityException`, blocking the transaction before it reaches the payment gateway.

### Churn Predictor
- Analyzes purchase frequency gaps.
- If a user surpasses 14 days without a top-up, they are flagged as `High Risk Churners`.
- The system automatically mints a personalized 10% Discount Promo Code and stores it in their inventory to entice a return.

---

## 4. Gamification & Gamified Economics (`gamification.ts`)

Users earn XP for spending money, creating a highly engaging hook.
- **Conversion**: 10,000 IDR spent = 10 XP.
- **Tiers**: Users level up through predefined tiers.
- **Cashback**: Higher tiers grant automated cashback. A `PLATINUM` user might get 2% cashback. When they buy a 100k item, 2k is instantly credited to their MiqStore Wallet balance, encouraging ecosystem retention.

---

## 5. Affiliate Engine (`affiliate.ts`)

A native referral system allowing users to become "Creators".
- Users generate a unique `referralCode` (e.g., `MIQ-FROST`).
- When a new user registers using that code, their `referredBy` field is permanently locked to the Creator.
- Upon successful transaction, the `EventBus` triggers the affiliate worker. The worker calculates a fixed percentage (e.g., 0.5%) of the `total` revenue and credits it to the Creator's Wallet as `BONUS` balance.

---

## 6. Enterprise Telemetry (`telemetry.ts`)

The entire application uses a centralized SDK for logging and metrics, heavily inspired by OpenTelemetry and Prometheus.

- `logger.info()`: Replaces `console.log`. Outputs strict JSON (timestamp, severity, contextual payloads) designed to be instantly digested by Grafana Loki.
- `metrics.increment()`: Tracks system counters (e.g., `topup_success_apigames`, `fraud_blocks`) in memory, ready to be scraped by a Prometheus `/metrics` endpoint.
- `tracing.startSpan()`: Wraps expensive operations to track latency execution time, making performance bottlenecks immediately visible in production.
