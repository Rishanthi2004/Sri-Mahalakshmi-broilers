import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ENQUIRY_TRANSLATIONS, getLocalizedEnquiry } from "@/data/enquiries";

interface EnquiryRow {
  id: string;
  customer_name: string;
  customer_name_en?: string;
  phone_number: string;
  message: string;
  message_en?: string;
  status: "new" | "contacted" | "resolved";
  submitted_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const db = getDb();

    let query = "SELECT * FROM enquiries WHERE 1=1";
    const params: string[] = [];

    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }
    query += " ORDER BY submitted_at DESC";

    const rows = db.prepare(query).all(...params) as unknown as EnquiryRow[];
    return NextResponse.json(
      rows.map((r) => {
        const enLoc = getLocalizedEnquiry(
          {
            id: r.id,
            customerName: r.customer_name,
            customerNameEn: r.customer_name_en,
            message: r.message,
            messageEn: r.message_en,
          },
          "en"
        );
        return {
          id: r.id,
          customerName: r.customer_name,
          customerNameEn: r.customer_name_en || enLoc.customerName,
          phoneNumber: r.phone_number,
          message: r.message,
          messageEn: r.message_en || enLoc.message,
          status: r.status,
          submittedAt: r.submitted_at,
        };
      })
    );
  } catch (error) {
    console.error("Enquiries GET error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phoneNumber, message } = body;

    if (!customerName || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "Customer name, phone number, and message are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `enq-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (id, customer_name, phone_number, message, status, submitted_at)
      VALUES (?, ?, ?, ?, 'new', ?)
    `).run(id, customerName.trim(), phoneNumber.trim(), message.trim(), now);

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully. Our team will contact you shortly.",
      enquiry: {
        id,
        customerName,
        phoneNumber,
        message,
        status: "new",
        submittedAt: now,
      },
    });
  } catch (error) {
    console.error("Enquiry POST error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

