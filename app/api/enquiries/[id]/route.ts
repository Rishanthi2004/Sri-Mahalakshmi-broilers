import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const db = getDb();
    db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);

    return NextResponse.json({ success: true, message: `Enquiry status changed to ${status}.` });
  } catch (error) {
    console.error("Enquiry PUT error:", error);
    return NextResponse.json({ error: "Failed to update enquiry status" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare("DELETE FROM enquiries WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Enquiry deleted." });
  } catch (error) {
    console.error("Enquiry DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}

