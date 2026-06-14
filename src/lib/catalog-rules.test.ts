import { describe, it, expect } from "vitest";
import { calculateSellingPrice, isGameAllowed } from "./catalog-rules";

describe("Catalog Rules", () => {
  describe("isGameAllowed", () => {
    it("should allow Mobile Legends", () => {
      expect(isGameAllowed("Mobile Legends")).toBe(true);
      expect(isGameAllowed("Mobile legends Bang Bang")).toBe(true);
    });

    it("should allow Free Fire", () => {
      expect(isGameAllowed("Free Fire")).toBe(true);
      expect(isGameAllowed("Garena Free Fire")).toBe(true);
    });

    it("should disallow Genshin Impact", () => {
      expect(isGameAllowed("Genshin Impact")).toBe(false);
    });
  });

  describe("calculateSellingPrice Auto Margin Engine", () => {
    it("should prevent negative values", () => {
      expect(calculateSellingPrice(-1000)).toBe(0);
    });

    it("should add 2000 for price < 20000", () => {
      expect(calculateSellingPrice(10000)).toBe(12000);
      expect(calculateSellingPrice(19999)).toBe(21999);
      expect(calculateSellingPrice(0)).toBe(2000);
    });

    it("should apply 10% margin for 20000 <= price <= 50000", () => {
      expect(calculateSellingPrice(20000)).toBe(22000); // 20000 * 1.10
      expect(calculateSellingPrice(30000)).toBe(33000); // 30000 * 1.10
      expect(calculateSellingPrice(50000)).toBe(55000); // 50000 * 1.10
    });

    it("should apply 8% margin for 50000 < price <= 100000", () => {
      expect(calculateSellingPrice(50001)).toBe(54002); // 50001 * 1.08 = 54001.08 -> 54002
      expect(calculateSellingPrice(100000)).toBe(108000); // 100000 * 1.08
    });

    it("should apply 6% margin for price > 100000", () => {
      expect(calculateSellingPrice(100001)).toBe(106002); // 100001 * 1.06 = 106001.06 -> 106002
      expect(calculateSellingPrice(200000)).toBe(212000); // 200000 * 1.06
    });
  });
});
