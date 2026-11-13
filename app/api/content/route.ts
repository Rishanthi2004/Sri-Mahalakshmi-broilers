import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value FROM content WHERE key = 'website_content'").get() as { value: string } | undefined;
    if (!row) {
      return NextResponse.json(DEFAULT_WEBSITE_CONTENT);
    }
    const content = JSON.parse(row.value);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json(DEFAULT_WEBSITE_CONTENT);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    const now = new Date().toISOString();
    const valueStr = JSON.stringify(body);

    db.prepare(`
      INSERT INTO content (key, value, updated_at)
      VALUES ('website_content', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(valueStr, now);

    return NextResponse.json({ success: true, content: body });
  } catch (error) {
    console.error("Content PUT error:", error);
    return NextResponse.json({ error: "Failed to update website content" }, { status: 500 });
  }
}

