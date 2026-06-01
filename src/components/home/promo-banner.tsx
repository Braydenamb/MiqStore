"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROMO_BANNERS } from "@/lib/constants";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function PromoBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative py-8 sm:py-12" id="promo-banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="relative overflow-hidden rounded-3xl"
        >
          <CarouselContent className="-ml-0">
            {PROMO_BANNERS.map((banner) => (
              <CarouselItem key={banner.id} className="pl-0">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl bg-gradient-to-r p-8 sm:p-12 md:p-16",
                    banner.gradient
                  )}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                  
                  {/* Magic UI Border Beam */}
                  <BorderBeam duration={12} size={400} className="opacity-70" colorFrom="#ffffff" colorTo="transparent" />

                  <div className="relative z-10 max-w-lg">
                    {banner.badge && (
                      <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {banner.badge}
                      </Badge>
                    )}
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                      {banner.title}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
                      {banner.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="mt-6 bg-white text-gray-900 hover:bg-white/90 shadow-xl"
                      asChild
                    >
                      <Link href={banner.href}>
                        {banner.cta}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious
            variant="glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-2xl border-none [&_svg]:h-5 [&_svg]:w-5"
          />
          <CarouselNext
            variant="glass"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-2xl border-none [&_svg]:h-5 [&_svg]:w-5"
          />
        </Carousel>

        {/* Dots Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {PROMO_BANNERS.map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-8 bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)]"
                  : "w-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground))]"
              )}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
