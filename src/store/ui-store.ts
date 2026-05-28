import { create } from "zustand";

interface UIState {
  /** Whether the mobile nav sheet is open */
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  /** Whether the search command palette is open */
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  /** Active category filter on games page */
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  /** Scroll position for floating navbar effect */
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  activeCategory: "all",
  setActiveCategory: (category) => set({ activeCategory: category }),

  isScrolled: false,
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));
