import { HeroSection } from "@/components/home/hero-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { PopularGames } from "@/components/home/popular-games";
import { PromoBanner } from "@/components/home/promo-banner";
import { StatsSection } from "@/components/home/stats-section";
import { NewsCarousel } from "@/components/home/news-carousel";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default async function HomePage() {
  // Simulasi pemanggilan API/Database Backend (misal: fetch daftar promo dari database)
  // Ini akan memicu file loading.tsx (Splash Screen) muncul selama 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Fetch dynamic hero banner
  const heroBannerSetting = await getSetting("hero_banner");
  const heroBannerUrl = heroBannerSetting 
    ? (heroBannerSetting.startsWith("http") ? heroBannerSetting : cloudinaryUrl(heroBannerSetting))
    : undefined;

  return (
    <>
      <NewsCarousel />
      <HeroSection heroBannerUrl={heroBannerUrl} />
      <FeatureStrip />
      <PopularGames />
      <PromoBanner />
      <StatsSection />
    </>
  );
}
