/**
 * Server-side Cloudinary SDK singleton.
 * Import this in any Server Action that needs to call the Cloudinary Management API.
 * Do NOT import from here in client components.
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
