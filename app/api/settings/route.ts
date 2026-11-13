import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value FROM content WHERE key = 'website_content'").get() as { value: string } | undefined;
    const content = row ? JSON.parse(row.value) : DEFAULT_WEBSITE_CONTENT;

    return NextResponse.json({
      shopName: content.shopName,
      tagline: content.tagline,
      logoUrl: content.logoUrl,
      faviconUrl: content.faviconUrl,
      contact: content.contact,
      socialLinks: content.socialLinks,
      footer: content.footer,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const row = db.prepare("SELECT value FROM content WHERE key = 'website_content'").get() as { value: string } | undefined;
    const current = row ? JSON.parse(row.value) : DEFAULT_WEBSITE_CONTENT;

    const updated = {
      ...current,
      shopName: body.shopName ?? current.shopName,
      tagline: body.tagline ?? current.tagline,
      logoUrl: body.logoUrl ?? current.logoUrl,
      faviconUrl: body.faviconUrl ?? current.faviconUrl,
      contact: {
        ...current.contact,
        ...(body.contact || {}),
      },
      socialLinks: {
        ...current.socialLinks,
        ...(body.socialLinks || {}),
      },
      footer: {
        ...current.footer,
        ...(body.footer || {}),
      },
    };

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO content (key, value, updated_at)
      VALUES ('website_content', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(JSON.stringify(updated), now);

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

