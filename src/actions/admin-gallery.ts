"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

// Initialize Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryAsset {
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: "image" | "video" | "raw";
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: unknown;
  etag: string;
  created_by: unknown;
  uploaded_by: unknown;
}

/**
 * Fetches all assets (images, videos) from a specific Cloudinary folder.
 */
export async function getGalleryAssets(folder?: string): Promise<CloudinaryAsset[]> {
  try {
    await requireAdmin();

    const result = await cloudinary.search
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    return result.resources as CloudinaryAsset[];
  } catch (error) {
    console.error("[Cloudinary API Error] Failed to fetch gallery assets:", error);
    return [];
  }
}

/**
 * Deletes an asset from Cloudinary using its public_id.
 * Note: Cloudinary requires the resource_type to delete non-image files successfully.
 */
export async function deleteGalleryAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  try {
    await requireAdmin();

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    revalidatePath("/admin/gallery");

    return { success: true, result };
  } catch (error) {
    console.error("[Cloudinary API Error] Failed to delete gallery asset:", error);
    return { success: false, error: "Failed to delete asset from Cloudinary." };
  }
}
