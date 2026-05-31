import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { createSnapTransaction } from "@/lib/services/midtrans";
import { prisma } from "@/lib/prisma";
import { generateInvoiceId } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, method } = body;

    if (!amount || amount < 10000) {
      return API_ERRORS.validation({ amount: ["Minimum deposit is 10,000 IDR"] });
    }

    // 1. In production: Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) return API_ERRORS.unauthorized();

    const userId = session.user.id; 
    const userName = session.user.name || "User";

    // 2. We treat wallet deposit as a special transaction in the DB
    // We can use a reserved "productId" for Wallet Topup or just handle it uniquely.
    // For now, let's create a Transaction record to track the payment flow.

    // Note: We are mocking the DB insert since this requires a real Product to exist for foreign keys.
    // In a real flow, you'd have a system product called 'WALLET_DEPOSIT'.
    const invoiceId = generateInvoiceId();
    
    // 3. Generate Midtrans Snap token for the deposit
    const snapResult = await createSnapTransaction({
      orderId: invoiceId,
      amount: amount, // No fees for deposit
      customerName: userName,
      customerEmail: "demo@example.com",
      itemName: "MiqStore Wallet Deposit",
      itemCategory: "WALLET",
    });

    return apiSuccess({
      invoiceId,
      snapToken: snapResult.token,
      paymentUrl: snapResult.redirectUrl,
    });

  } catch (error) {
    console.error("Wallet Deposit Error:", error);
    return API_ERRORS.internal("Failed to initiate deposit");
  }
}
