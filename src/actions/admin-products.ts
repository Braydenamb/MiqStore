"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";

async function ensureDefaultCategory() {
  let category = await prisma.category.findFirst({
    where: { slug: "mobile-games" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Mobile Games",
        slug: "mobile-games",
        description: "Default category for games",
        isActive: true,
      },
    });
  }

  return category;
}

export async function getAdminProducts(page: number = 1, limit: number = 50) {
  try {
    await requireAdmin();

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          _count: {
            select: { items: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.product.count(),
    ]);

    return {
      success: true,
      data: products,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function createAdminProduct(data: {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  image?: string;
  banner?: string;
  gallery?: string[];
}) {
  try {
    const admin = await requireAdmin();

    const category = await ensureDefaultCategory();

    const newProduct = await prisma.product.create({
      data: {
        categoryId: category.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        image: data.image || null,
        banner: data.banner || null,
        gallery: data.gallery || [],
        gameType: "mobile",
      },
    });

    revalidatePath("/admin/products");

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE_PRODUCT",
      entity: "PRODUCT",
      entityId: newProduct.id,
      newValues: { name: newProduct.name, slug: newProduct.slug, isActive: newProduct.isActive },
    });

    return { success: true, data: newProduct };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Slug already exists. Please choose a different slug." };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateAdminProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    image?: string;
    banner?: string;
    gallery?: string[];
  }
) {
  try {
    const admin = await requireAdmin();

    const oldProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true, isActive: true },
    });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        image: data.image || null,
        banner: data.banner || null,
        gallery: data.gallery || [],
      },
    });

    revalidatePath("/admin/products");

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE_PRODUCT",
      entity: "PRODUCT",
      entityId: id,
      oldValues: oldProduct as Prisma.InputJsonValue | null,
      newValues: { name: updatedProduct.name, slug: updatedProduct.slug, isActive: updatedProduct.isActive },
    });

    return { success: true, data: updatedProduct };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Slug already exists. Please choose a different slug." };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteAdminProduct(id: string) {
  try {
    const admin = await requireAdmin();

    const oldProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true },
    });

    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE_PRODUCT",
      entity: "PRODUCT",
      entityId: id,
      oldValues: oldProduct as Prisma.InputJsonValue | null,
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
