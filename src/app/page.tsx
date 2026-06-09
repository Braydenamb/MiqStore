import { HeroSection } from "@/components/home/hero-section";
import { NewsCarousel } from "@/components/home/news-carousel";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default async function HomePage() {
  // Fetch dynamic hero banner
  const heroBannerSetting = await getSetting("hero_banner");
  const heroBannerUrl = heroBannerSetting 
    ? (heroBannerSetting.startsWith("http") ? heroBannerSetting : cloudinaryUrl(heroBannerSetting))
    : undefined;

  return (
    <>
      <NewsCarousel />
      <HeroSection heroBannerUrl={heroBannerUrl} />
    </>
  );
}
