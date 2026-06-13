import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return API_ERRORS.unauthorized();

    const { id: invoiceId } = await params;

    if (!invoiceId) {
      return API_ERRORS.validation({ id: ["Invoice ID is required"] });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId },
    });

    if (!transaction) return apiError("Transaction not found", { status: 404 });

    // Ownership check: only the owner or admin can cancel
    const userRole = session.user.role;
    if (transaction.userId !== session.user.id && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return API_ERRORS.forbidden();
    }

    if (transaction.status !== "PENDING") return apiError("Hanya pesanan pending yang dapat dibatalkan", { status: 400 });

    await prisma.transaction.update({
      where: { invoiceId },
      data: { status: "FAILED", updatedAt: new Date() },
    });

    // Also update payment record
    await prisma.payment.updateMany({
        where: { transactionId: transaction.id },
        data: { status: "FAILED" }
    });

    return apiSuccess({ status: "failed" }, { message: "Pesanan berhasil dibatalkan" });
  } catch (error) {
    return apiError("Gagal membatalkan pesanan", { status: 500 });
  }
}
