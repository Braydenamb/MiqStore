# MiqStore Project Updates & Roadmap

## Skipped / Postponed Features
- **AI-Powered Insights & Smart Recommendations**
  - *Status:* Temporarily Skipped
  - *Description:* The `AiInsights` component (Spending Insights, Savings Tracker, and Behavioral Recommendation Targeting) was fully designed and built but has been temporarily removed from the main dashboard layout per user request.
  - *Action Required for Future:* When ready, simply re-import `AiInsights` from `@/components/dashboard/ai-insights` into `src/app/dashboard/page.tsx` and place it below the `StatsGrid`. The component file already exists in the components directory.

- **Homepage Clutter (Features, Promo, Stats)**
  - *Status:* Temporarily Skipped
  - *Description:* The `FeatureStrip`, `PromoBanner`, and `StatsSection` components were removed from the homepage (`/`) to prioritize user focus on actionable goals (Top Up).
  - *Action Required for Future:* Import and add them back to `src/app/page.tsx` if marketing elements are needed. The components are preserved in `src/components/home/`.
