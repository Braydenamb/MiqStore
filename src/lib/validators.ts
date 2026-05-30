import { z } from "zod";

/**
 * Zod validation schemas for all API inputs.
 * Used in API routes and form validation.
 */

// ─── Auth ────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z
      .string()
      .regex(/^08\d{8,12}$/, "Nomor HP tidak valid (format: 08xxxxxxxxxx)")
      .optional(),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// ─── Transactions ────────────────────────────────

export const createTransactionSchema = z.object({
  productItemId: z.string().uuid("Product item ID tidak valid"),
  paymentMethod: z.string().min(1, "Metode pembayaran wajib dipilih"),
  gameUserId: z.string().min(1, "User ID wajib diisi").optional(),
  gameZoneId: z.string().optional(),
  promoCode: z.string().optional(),
});

// ─── Products (Admin) ────────────────────────────

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1, "Nama produk wajib diisi").max(200),
  slug: z.string().min(1).max(200),
  publisher: z.string().optional(),
  description: z.string().optional(),
  gameType: z.enum(["mobile", "pc", "console"]).optional(),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

export const createProductItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1).max(200),
  amount: z.number().int().positive(),
  price: z.number().int().positive("Harga harus lebih dari 0"),
  originalPrice: z.number().int().positive().optional(),
  resellerPrice: z.number().int().positive().optional(),
  providerCode: z.string().optional(),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

// ─── Promo Codes ─────────────────────────────────

export const createPromoSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9]+$/, "Kode promo hanya boleh huruf kapital dan angka"),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  discountType: z.enum(["percent", "flat"]),
  discountValue: z.number().int().positive(),
  minPurchase: z.number().int().default(0),
  maxDiscount: z.number().int().positive().optional(),
  maxUsage: z.number().int().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// ─── User Profile ────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^08\d{8,12}$/)
    .optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password tidak cocok",
    path: ["confirmNewPassword"],
  });

// ─── Reseller ────────────────────────────────────

export const depositSchema = z.object({
  amount: z
    .number()
    .int()
    .min(50000, "Minimal deposit Rp50.000")
    .max(100000000, "Maksimal deposit Rp100.000.000"),
  paymentMethod: z.string().min(1),
});

// ─── Helpers ─────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
