import { getAdminSettings } from "@/actions/admin-settings";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const { data: settings } = await getAdminSettings();
  
  return <SettingsClient initialSettings={settings || {}} />;
}
