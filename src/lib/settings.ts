import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

/**
 * Fetches all site settings from the database as a key-value dictionary.
 * Cached to avoid hitting the database on every page load.
 */
export const getCachedSettings = unstable_cache(
  async () => {
    try {
      const settingsList = await prisma.setting.findMany();
      const settingsDict: Record<string, string> = {};
      
      settingsList.forEach((setting) => {
        settingsDict[setting.key] = setting.value;
      });
      
      return settingsDict;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return {};
    }
  },
  ["site-settings"],
  { revalidate: 60, tags: ["settings"] }
);

export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  const settings = await getCachedSettings();
  return settings[key] ?? defaultValue;
}
