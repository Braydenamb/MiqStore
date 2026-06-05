import { getGalleryAssets } from "@/actions/admin-gallery";
import { GalleryClient } from "./GalleryClient";

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  // Fetch initial assets from the default 'Gallery' folder
  const initialAssets = await getGalleryAssets("Gallery");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-[hsl(var(--foreground))]">Media Gallery</h1>
        <p className="text-gray-500 mt-2">Manage all your image and video assets here. Upload new media, copy their links, and use them anywhere on your site.</p>
      </div>

      <GalleryClient initialAssets={initialAssets} />
    </div>
  );
}
