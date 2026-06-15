import { HeroSection } from "@/components/home/hero-section";
import { NewsCarousel } from "@/components/home/news-carousel";
import { PopularGames } from "@/components/home/popular-games";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { getPublicGames } from "@/actions/public-games";

export const revalidate = 3600; // Cache homepage for 1 hour

export default async function HomePage() {
  // Fetch dynamic hero banner
  const heroBannerSetting = await getSetting("hero_banner");
  const heroBannerUrl = heroBannerSetting 
    ? (heroBannerSetting.startsWith("http") ? heroBannerSetting : cloudinaryUrl(heroBannerSetting))
    : undefined;

  // Fetch games for categories
  const games = await getPublicGames();

  return (
    <div className="flex flex-col min-h-screen">
      <NewsCarousel />
      <HeroSection heroBannerUrl={heroBannerUrl} />
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        <PopularGames initialGames={games} />
      </div>
    </div>
  );
}
