"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,       // Data dianggap basi setelah 10 detik (was 60s)
            gcTime: 5 * 60 * 1000,      // Tetap di cache 5 menit untuk navigasi cepat
            refetchOnWindowFocus: true,  // Refresh saat user kembali ke tab (was false)
            refetchOnReconnect: true,    // Refresh saat koneksi kembali
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
