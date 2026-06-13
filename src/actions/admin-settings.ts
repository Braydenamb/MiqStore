"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidateTag } from "next/cache";

export async function getAdminSettings() {
  try {
    await requireAdmin();

    const settings = await prisma.setting.findMany();
    const settingsDict: Record<string, string> = {};
    settings.forEach((s) => {
      settingsDict[s.key] = s.value;
    });
    return { success: true, data: settingsDict };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch settings:", msg);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function saveAdminSettings(settingsDict: Record<string, string>, group: string = "general") {
  try {
    await requireAdmin();

    const keys = Object.keys(settingsDict);

    // Use $transaction for atomic batch upsert — all-or-nothing
    await prisma.$transaction(
      keys.map((key) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: settingsDict[key], group },
          create: { key, value: settingsDict[key], group },
        })
      )
    );

    revalidateTag("settings", {});

    return { success: true, message: "Settings saved successfully" };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save settings:", msg);
    return { success: false, error: "Failed to save settings" };
  }
}
