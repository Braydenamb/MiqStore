import { Resend } from 'resend';
import { logger } from '@/lib/telemetry';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'noreply@miqstore.online';

export interface OrderEmailData {
  to: string;
  customerName: string;
  invoiceId: string;
  gameName: string;
  productName: string;
  price: number;
}

export async function sendOrderCreatedEmail(data: OrderEmailData) {
  if (!resend || !data.to) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Pesanan Dibuat - ${data.invoiceId}`,
      html: `
        <h2>Halo ${data.customerName},</h2>
        <p>Pesanan kamu untuk <strong>${data.gameName} - ${data.productName}</strong> telah berhasil dibuat.</p>
        <p>Silakan selesaikan pembayaran sebesar <strong>Rp ${data.price.toLocaleString('id-ID')}</strong>.</p>
        <p>ID Pesanan: ${data.invoiceId}</p>
        <br/>
        <p>Terima kasih telah berbelanja di MiqStore!</p>
      `,
    });
    logger.info("Order created email sent", { invoiceId: data.invoiceId, to: data.to });
  } catch (error) {
    logger.error("Failed to send order created email", error);
  }
}

export async function sendOrderSuccessEmail(data: OrderEmailData) {
  if (!resend || !data.to) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Pembayaran Berhasil - ${data.invoiceId}`,
      html: `
        <h2>Halo ${data.customerName},</h2>
        <p>Pembayaran untuk pesanan <strong>${data.gameName} - ${data.productName}</strong> telah kami terima.</p>
        <p>Pesanan kamu sedang diproses dan akan segera masuk ke akun game kamu.</p>
        <p>ID Pesanan: ${data.invoiceId}</p>
        <br/>
        <p>Terima kasih telah berbelanja di MiqStore!</p>
      `,
    });
    logger.info("Order success email sent", { invoiceId: data.invoiceId, to: data.to });
  } catch (error) {
    logger.error("Failed to send order success email", error);
  }
}

export async function sendOrderFailedEmail(data: OrderEmailData) {
  if (!resend || !data.to) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Pesanan Dibatalkan - ${data.invoiceId}`,
      html: `
        <h2>Halo ${data.customerName},</h2>
        <p>Pesanan kamu untuk <strong>${data.gameName} - ${data.productName}</strong> telah dibatalkan atau pembayaran kedaluwarsa.</p>
        <p>ID Pesanan: ${data.invoiceId}</p>
        <br/>
        <p>Silakan buat pesanan baru jika kamu masih ingin melakukan top up.</p>
        <p>Terima kasih telah berkunjung ke MiqStore!</p>
      `,
    });
    logger.info("Order failed email sent", { invoiceId: data.invoiceId, to: data.to });
  } catch (error) {
    logger.error("Failed to send order failed email", error);
  }
}
