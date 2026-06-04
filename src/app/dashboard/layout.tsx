import DashboardLayoutClient from "./DashboardLayoutClient";
import { getSetting } from "@/lib/settings";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const siteLogo = await getSetting("site_logo");
  const logoUrl = siteLogo ? (siteLogo.startsWith("http") ? siteLogo : cloudinaryUrl(siteLogo)) : undefined;

  return (
    <DashboardLayoutClient logoUrl={logoUrl}>
      {children}
    </DashboardLayoutClient>
  );
}
