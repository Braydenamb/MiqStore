"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    
    // Send anonymous pageview to internal API
    fetch("/api/telemetry/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true, 
    }).catch(() => {
      // fail silently, analytics shouldn't break the app
    });
  }, [pathname]);

  return null;
}
