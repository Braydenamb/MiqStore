"use client";

import { Typography } from "@/components/typography";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { label: "Pelanggan Aktif", value: 50, suffix: "K+" },
  { label: "Transaksi Berhasil", value: 1, suffix: "M+" },
  { label: "Rating Kepuasan", value: 4.9, suffix: "/5", decimalPlaces: 1 },
  { label: "Uptime Server", value: 99.9, suffix: "%", decimalPlaces: 1 },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-[hsl(var(--card))]/40 backdrop-blur-xl relative overflow-hidden border-y border-white/5">
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center px-4"
            >
              <Typography.Heading level="h2" className="text-[hsl(var(--foreground))] mb-2 font-bold drop-shadow-sm flex items-center justify-center">
                <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces || 0} />
                <span>{stat.suffix}</span>
              </Typography.Heading>
              <Typography.Label className="text-[var(--color-gold)] font-medium tracking-widest uppercase">
                {stat.label}
              </Typography.Label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
