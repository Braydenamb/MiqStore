export const ALLOWED_GAMES = [
  "Mobile Legends",
  "Free Fire",
  "PUBG Mobile",
  "Valorant",
];

export function isGameAllowed(gameName: string): boolean {
  return ALLOWED_GAMES.some((allowed) => 
    gameName.toLowerCase().includes(allowed.toLowerCase())
  );
}

/**
 * Auto Margin Pricing Engine
 * Calculate selling price based on base price.
 * 
 * Rules:
 * if price < 20000: sellingPrice = price + 2000
 * if 20000 <= price <= 50000: sellingPrice = price * 1.10
 * if 50000 < price <= 100000: sellingPrice = price * 1.08
 * if price > 100000: sellingPrice = price * 1.06
 */
export function calculateSellingPrice(basePrice: number): number {
  if (basePrice < 0) return 0; // Prevent negative values
  
  let sellingPrice = basePrice;
  
  if (basePrice < 20000) {
    sellingPrice = basePrice + 2000;
  } else if (basePrice <= 50000) {
    sellingPrice = basePrice * 1.10;
  } else if (basePrice <= 100000) {
    sellingPrice = basePrice * 1.08;
  } else {
    sellingPrice = basePrice * 1.06;
  }
  
  return Math.ceil(sellingPrice);
}
