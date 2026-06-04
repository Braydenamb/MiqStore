"use client";

import { Zap, ShieldCheck, Tag, Clock } from "lucide-react";
import { Typography } from "@/components/typography";

const features = [
  { icon: Zap, title: "Proses Instan", subtitle: "Hitungan detik masuk" },
  { icon: ShieldCheck, title: "Transaksi Aman", subtitle: "100% garansi aman" },
  { icon: Tag, title: "Harga Termurah", subtitle: "Promo setiap hari" },
  { icon: Clock, title: "CS 24/7", subtitle: "Siap bantu kendalamu" },
];

export function FeatureStrip() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <Typography.Heading level="h4" className="mb-1 font-semibold">
                  {feature.title}
                </Typography.Heading>
                <Typography.Body size="sm" color="muted">
                  {feature.subtitle}
                </Typography.Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
