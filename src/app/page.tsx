import { HeroSection } from "@/components/home/hero-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { PopularGames } from "@/components/home/popular-games";
import { PromoBanner } from "@/components/home/promo-banner";
import { StatsSection } from "@/components/home/stats-section";

export default function HomePage() {
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
