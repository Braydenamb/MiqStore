"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

// Gunakan global prisma client agar tidak membuat banyak koneksi di dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAdminProduct(data: {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  image?: string;
  banner?: string;
}) {
  try {
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
        gameType: "mobile",
      },
    });

    revalidatePath("/admin/products");
    return { success: true, data: newProduct };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose a different slug." };
    }
    return { success: false, error: error.message };
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
  }
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        image: data.image || null,
        banner: data.banner || null,
      },
    });

    revalidatePath("/admin/products");
    return { success: true, data: updatedProduct };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Slug already exists. Please choose a different slug." };
    }
    return { success: false, error: error.message };
  }
}

export async function deleteAdminProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
