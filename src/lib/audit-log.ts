import { prisma } from "./prisma";
import { logger } from "./telemetry";
import { Prisma } from "@prisma/client";

/**
 * Creates an admin audit log entry in the database.
 * All admin mutations (create, update, delete) MUST call this function.
 *
 * @param adminId - The authenticated admin's user ID
 * @param action - Descriptive action string (e.g., "UPDATE_PRICE", "CREATE_PRODUCT")
 * @param entity - The model name (e.g., "PRODUCT_ITEM", "USER")
 * @param entityId - The affected record's ID
 * @param oldValues - JSON snapshot of the record before the change (null for creates)
 * @param newValues - JSON snapshot of the record after the change (null for deletes)
 */
export async function createAuditLog({
  adminId,
  action,
  entity,
  entityId,
  oldValues = null,
  newValues = null,
}: {
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: Prisma.InputJsonValue | null;
  newValues?: Prisma.InputJsonValue | null;
}): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        oldValues: oldValues ?? Prisma.JsonNull,
        newValues: newValues ?? Prisma.JsonNull,
      },
    });

    logger.info("Audit log created", { adminId, action, entity, entityId });
  } catch (error) {
    // Audit logging must never break the primary operation.
    // Log the failure but do not re-throw.
    logger.error("Failed to create audit log", error, {
      adminId,
      action,
      entity,
      entityId,
    });
  }
}
