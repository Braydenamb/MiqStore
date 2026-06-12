import { ShieldCheck, Zap } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface GameBannerProps {
  game: {
    name: string;
    publisher: string;
    banner: string;
    image: string;
  };
}

export function GameBanner({ game }: GameBannerProps) {
  return (
    <div className="w-full relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-32 lg:pb-24 bg-black">
      {/* Background Banner with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 blur-[8px] scale-110"
        style={{ backgroundImage: game.banner ? `url('${game.banner.startsWith('http') ? game.banner : cloudinaryUrl(game.banner)}')` : 'none' }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none z-10" />
      
      {/* Colorful Abstract Accents */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-[hsl(var(--primary))]/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-[var(--color-gold)]/20 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl bg-[hsl(var(--background))] p-1 shadow-2xl shrink-0 border border-white/20 relative overflow-hidden">
           <div 
             className="w-full h-full rounded-xl bg-cover bg-center"
             style={{ backgroundImage: game.image ? `url('${game.image.startsWith('http') ? game.image : cloudinaryUrl(game.image)}')` : 'none' }}
           />
        </div>
        <div className="pb-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-2 md:mb-3 drop-shadow-md text-white">
            {game.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium text-white/80">
            <span className="flex items-center gap-1.5 text-white/90">
              <ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" /> {game.publisher}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <span className="flex items-center gap-1.5 text-white/90">
              <Zap className="h-4 w-4 text-yellow-400" /> Proses 1-5 Menit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
