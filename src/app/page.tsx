import { HeroSection } from "@/components/home/hero-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { PopularGames } from "@/components/home/popular-games";
import { PromoBanner } from "@/components/home/promo-banner";
import { StatsSection } from "@/components/home/stats-section";
import { NewsCarousel } from "@/components/home/news-carousel";

export default async function HomePage() {
  // Simulasi pemanggilan API/Database Backend (misal: fetch daftar promo dari database)
  // Ini akan memicu file loading.tsx (Splash Screen) muncul selama 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <>
      <HeroSection />
      <NewsCarousel />
      <FeatureStrip />
      <PopularGames />
      <PromoBanner />
      <StatsSection />
    </>
  );
}
