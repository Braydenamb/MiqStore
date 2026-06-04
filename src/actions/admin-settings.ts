"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function getAdminSettings() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsDict: Record<string, string> = {};
    settings.forEach((s) => {
      settingsDict[s.key] = s.value;
    });
    return { success: true, data: settingsDict };
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function saveAdminSettings(settingsDict: Record<string, string>, group: string = "general") {
  try {
    const keys = Object.keys(settingsDict);
    
    // Process sequentially or use Promise.all to upsert keys
    for (const key of keys) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: settingsDict[key], group },
        create: { key, value: settingsDict[key], group },
      });
    }

    revalidateTag("settings", {});

    return { success: true, message: "Settings saved successfully" };
  } catch (error: any) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
