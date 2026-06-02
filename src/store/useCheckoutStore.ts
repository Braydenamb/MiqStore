import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  bonus?: string;
  icon?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  fee?: number;
}

interface GameDetails {
  id: string;
  name: string;
  image: string;
  publisher: string;
}

interface CheckoutState {
  game: GameDetails | null;
  userId: string;
  zoneId: string;
  selectedProduct: Product | null;
  selectedPayment: PaymentMethod | null;
  setGame: (game: GameDetails) => void;
  setUserId: (id: string) => void;
  setZoneId: (id: string) => void;
  setSelectedProduct: (product: Product) => void;
  setSelectedPayment: (payment: PaymentMethod) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  game: null,
  userId: "",
  zoneId: "",
  selectedProduct: null,
  selectedPayment: null,
  setGame: (game) => set({ game }),
  setUserId: (userId) => set({ userId }),
  setZoneId: (zoneId) => set({ zoneId }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setSelectedPayment: (selectedPayment) => set({ selectedPayment }),
  reset: () => set({ game: null, userId: "", zoneId: "", selectedProduct: null, selectedPayment: null }),
}));
