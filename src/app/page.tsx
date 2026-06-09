import { HeroSection } from "@/components/home/hero-section";
import { PopularGames } from "@/components/home/popular-games";
import { NewsCarousel } from "@/components/home/news-carousel";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { getPopularGames } from "@/actions/public-games";

export default async function HomePage() {
  // Fetch dynamic hero banner & popular games in parallel
  const [heroBannerSetting, popularGames] = await Promise.all([
    getSetting("hero_banner"),
    getPopularGames(),
  ]);
  const heroBannerUrl = heroBannerSetting 
    ? (heroBannerSetting.startsWith("http") ? heroBannerSetting : cloudinaryUrl(heroBannerSetting))
    : undefined;

  return (
    <>
      <NewsCarousel />
      <HeroSection heroBannerUrl={heroBannerUrl} />
      <PopularGames initialGames={popularGames} />
    </>
  );
}
