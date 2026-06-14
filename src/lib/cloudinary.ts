/**
 * Helper to generate Cloudinary optimized URLs.
 * Automatically applies f_auto and q_auto for the best format and quality.
 */
export function cloudinaryUrl(publicId: string, maxWidth: number = 1200) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const encodedId = encodeURI(publicId);
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_${maxWidth},f_auto,q_auto/${encodedId}`;
}
