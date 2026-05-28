import { HeroSection } from "@/components/home/hero-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { PopularGames } from "@/components/home/popular-games";
import { CategorySection } from "@/components/home/category-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBanner />
      <PopularGames />
      <CategorySection />
      <StatsSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
