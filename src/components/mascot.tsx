"use client";

import dynamic from "next/dynamic";

// Next.js 15 requires dynamic with ssr: false to be used exclusively inside Client Components.
const MascotClient = dynamic(() => import("./mascot-client"), {
  ssr: false,
});

export default function Mascot() {
  return <MascotClient />;
}
