import { NextRequest } from "next/server";

export type AuditAction = 
  | "USER_LOGIN"
  | "USER_REGISTER"
  | "TRANSACTION_CREATED"
  | "TRANSACTION_MANUAL_SUCCESS"
  | "SETTING_UPDATED"
  | "RECONCILIATION_RUN";

export interface AuditLogEntry {
  userId?: string;
  action: AuditAction;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit Log Utility
 * Used to record critical system and admin actions for security and compliance.
 */
export async function logAudit(entry: AuditLogEntry, req?: NextRequest) {
  const ip = req ? req.headers.get("x-forwarded-for") || "127.0.0.1" : entry.ipAddress;
  const ua = req ? req.headers.get("user-agent") : entry.userAgent;

  const logData = {
    ...entry,
    ipAddress: ip,
    userAgent: ua,
    timestamp: new Date().toISOString(),
  };

  // In production: await prisma.auditLog.create({ data: logData })
  // For development, we log to console
  console.log(`[AUDIT] ${logData.timestamp} | Action: ${logData.action} | User: ${logData.userId || 'SYSTEM'}`);
  if (Object.keys(logData.details).length > 0) {
    console.log(`        Details:`, logData.details);
  }

  return true;
}

/* ─── Prisma Schema Example ─── 
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  details   Json
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([action])
  @@index([createdAt])
  @@index([userId])
}
*/
