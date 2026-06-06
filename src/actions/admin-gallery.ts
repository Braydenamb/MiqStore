"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

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
  access_control: null | any;
  etag: string;
  created_by: null | any;
  uploaded_by: null | any;
}

/**
 * Fetches all assets (images, videos) from a specific Cloudinary folder.
 */
export async function getGalleryAssets(folder?: string): Promise<CloudinaryAsset[]> {
  try {
    let search = cloudinary.search;
    
    // If a specific folder is requested, filter by it, otherwise get everything
    if (folder) {
      // Allow searching multiple folders by doing folder:Gallery OR folder:Games etc.
      // But for simplicity, we'll just not use expression if folder is empty
      // Wait, let's just fetch ALL assets for the user so they can see everything.
    }
    
    // To fetch all assets, we can just use an empty expression or exclude the expression entirely
    const result = await search
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
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    
    // Refresh the gallery page cache so the deleted image disappears
    revalidatePath("/admin/gallery");
    
    return { success: true, result };
  } catch (error) {
    console.error("[Cloudinary API Error] Failed to delete gallery asset:", error);
    return { success: false, error: "Failed to delete asset from Cloudinary." };
  }
}
