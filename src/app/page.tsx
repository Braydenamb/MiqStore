import { HeroSection } from "@/components/home/hero-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { CategorySection } from "@/components/home/category-section";
import { NewsCarousel } from "@/components/home/news-carousel";
import { PopularGames } from "@/components/home/popular-games";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getPublicGames } from "@/actions/public-games";

export const revalidate = 3600; // Cache homepage for 1 hour

export default async function HomePage() {
  // Fetch games for categories
  const games = await getPublicGames();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureStrip />
      
      <div className="mt-8">
        <NewsCarousel />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <CategorySection />
        <PopularGames initialGames={games} />
      </div>

      <TestimonialsSection />
    </div>
  );
}

