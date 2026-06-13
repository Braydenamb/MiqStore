"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";
import { logger } from "@/lib/telemetry";
import { revalidateTag } from "next/cache";

/**
 * Allowlist of setting keys that can be modified via the admin UI.
 * Prevents arbitrary key injection from a compromised admin session.
 */
const ALLOWED_SETTING_KEYS = new Set([
  // General
  "site_name",
  "site_description",
  "site_logo",
  "footer_text",
  "contact_email",
  "contact_phone",
  "contact_whatsapp",
  // Payment
  "payment_instructions",
  "payment_auto_expire_minutes",
  // System
  "maintenance_mode",
  "maintenance_message",
  // Social
  "social_instagram",
  "social_tiktok",
  "social_youtube",
  "social_discord",
  // SEO
  "meta_title",
  "meta_description",
  "meta_keywords",
]);

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
    logger.error("Failed to fetch settings", error, { context: "getAdminSettings" });
    return { success: false, error: "Failed to load settings" };
  }
}

export async function saveAdminSettings(settingsDict: Record<string, string>, group: string = "general") {
  try {
    const admin = await requireAdmin();

    // Validate keys against allowlist
    const keys = Object.keys(settingsDict);
    const disallowedKeys = keys.filter((k) => !ALLOWED_SETTING_KEYS.has(k));
    if (disallowedKeys.length > 0) {
      logger.warn("Rejected disallowed setting keys", {
        adminId: admin.id,
        disallowedKeys,
      });
      return {
        success: false,
        error: `Disallowed setting keys: ${disallowedKeys.join(", ")}`,
      };
    }

    // Fetch old values for audit log
    const oldSettings = await prisma.setting.findMany({
      where: { key: { in: keys } },
    });
    const oldDict: Record<string, string> = {};
    oldSettings.forEach((s) => {
      oldDict[s.key] = s.value;
    });

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

    revalidateTag("settings", "default");

    // Sync maintenance mode to Redis for Edge middleware enforcement
    if ("maintenance_mode" in settingsDict) {
      try {
        const redis = (await import("@/lib/redis")).default;
        await redis.set("miqstore:maintenance_mode", settingsDict.maintenance_mode);
        logger.info("Maintenance mode synced to Redis", {
          value: settingsDict.maintenance_mode,
          adminId: admin.id,
        });
      } catch (redisErr) {
        logger.warn("Failed to sync maintenance mode to Redis", {
          error: redisErr,
          adminId: admin.id,
        });
      }
    }

    // Audit log
    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE_SETTINGS",
      entity: "SETTING",
      entityId: group,
      oldValues: oldDict,
      newValues: settingsDict,
    });

    return { success: true, message: "Settings saved successfully" };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save settings", error, { context: "saveAdminSettings" });
    return { success: false, error: "Failed to save settings" };
  }
}
