import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE products
      SET is_deleted = 0, deleted_at = NULL, updated_at = ?
      WHERE id = ?
    `).run(now, id);

    return NextResponse.json({
      success: true,
      message: "Product successfully restored to active catalog.",
    });
  } catch (error) {
    console.error("Product restore error:", error);
    return NextResponse.json({ error: "Failed to restore product" }, { status: 500 });
  }
}

