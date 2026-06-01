"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const [meteors, setMeteors] = useState<
    { id: number; left: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    const generateMeteors = () => {
      return new Array(number).fill(true).map((_, idx) => ({
        id: idx,
        left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
        delay: Math.random() * (1 - 0.2) + 0.2 + "s",
        duration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
      }));
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeteors(generateMeteors());
  }, [number]);

  if (meteors.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: -5,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        ></span>
      ))}
    </div>
  );
};
