"use server";

import { cloudinary } from "@/lib/cloudinary-server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { logger } from "@/lib/telemetry";
import { createAuditLog } from "@/lib/audit-log";

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
    logger.error("Failed to fetch gallery assets", error, { context: "Cloudinary" });
    return [];
  }
}

/**
 * Deletes an asset from Cloudinary using its public_id.
 * Note: Cloudinary requires the resource_type to delete non-image files successfully.
 */
export async function deleteGalleryAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  try {
    const admin = await requireAdmin();

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE_ASSET",
      entity: "CLOUDINARY_ASSET",
      entityId: publicId,
    });

    revalidatePath("/admin/gallery");

    return { success: true, result };
  } catch (error) {
    logger.error("Failed to delete gallery asset", error, { context: "Cloudinary", publicId });
    return { success: false, error: "Failed to delete asset from Cloudinary." };
  }
}
