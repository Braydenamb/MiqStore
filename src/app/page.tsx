import { HeroSection } from "@/components/home/hero-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { PopularGames } from "@/components/home/popular-games";
import { PromoBanner } from "@/components/home/promo-banner";
import { StatsSection } from "@/components/home/stats-section";

export default async function HomePage() {
  // Simulasi pemanggilan API/Database Backend (misal: fetch daftar promo dari database)
  // Ini akan memicu file loading.tsx (Splash Screen) muncul selama 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <PopularGames />
      <PromoBanner />
      <StatsSection />
    </>
  );
}
