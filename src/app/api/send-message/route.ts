import { NextResponse } from "next/server";
import { notaSchema } from "@/lib/formValidationSchemas";
import { rateLimit } from "@/lib/rate-limit";
import { formatPhoneNumber } from "@/lib/format";

export async function POST(req: Request) {
  try {
    // Ambil IP
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    // Rate limit
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak request" },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validasi input
    const data = notaSchema.parse(body);

    // Template nota
    const message = `
*INVOICE DIGITAL - TRANSAKSI REGULER*

*Wash and Care*
Nogotirto, Gamping, Sleman, DIY
📞 087852916445

=================
*Nomor Nota:* ${data.invoiceNumber}
*Pelanggan:* cs ${data.customerName}

*Tanggal Terima:* ${data.incomingDate} | ${data.incomingTime}
*Tanggal Selesai:* 2-3 Hari Kerja
=================

*Detail Pesanan:*
Orderan (Jumlah) : ${data.totalItem} Item
Layanan :
${data.serviceMessage}
Ket: ${data.note}

=================
*Detail Biaya:*
Total Tagihan : ${data.totalPrice}  
Grand Total : ${data.totalPrice}  

*Status:* ${data.paymentStatus}
*Pembayaran:* ${data.paymentMethod}
=================

*Lihat proses dan detail pesanan Anda :*
http://localhost:3000/order-tracking/${data.invoiceNumber}
 *Syarat dan Ketentuan:*
1. Pengambilan barang harap disertai nota  
2. Barang tidak diambil >1 bulan → hilang/rusak tidak diganti  
3. Barang rusak karena proses pengerjaan diganti max 5x biaya  
4. Klaim luntur di luar tanggungan  
5. Hak klaim berlaku 2 jam setelah barang diambil  
6. Konsumen dianggap setuju dengan perhitungan di atas

Terima kasih telah mempercayakan perawatan sepatu Anda di *Wash and Care*
`;

    const phoneNumber = formatPhoneNumber(data.phoneNumber);
    console.log(phoneNumber);

    // Kirim ke Fontee
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FONTEE_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: phoneNumber,
        message,
      }),
    });

    if (!res.ok) {
      throw new Error("Fontee API gagal");
    }

    const fonteeResult = await res.json();

    return NextResponse.json({
      success: true,
      fontee: fonteeResult,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
