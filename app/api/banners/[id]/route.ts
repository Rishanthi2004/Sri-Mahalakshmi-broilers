import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface BannerRow {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  cta_text: string | null;
  cta_link: string | null;
  position: "hero_main" | "promo_strip" | "offer_popup";
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const existing = db.prepare("SELECT * FROM banners WHERE id = ?").get(id) as BannerRow | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const title = body.title ?? existing.title;
    const subtitle = body.subtitle ?? existing.subtitle;
    const image = body.image ?? existing.image;
    const ctaText = body.ctaText ?? existing.cta_text;
    const ctaLink = body.ctaLink ?? existing.cta_link;
    const position = body.position ?? existing.position;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
    const sortOrder = body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sort_order;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE banners SET
        title = ?,
        subtitle = ?,
        image = ?,
        cta_text = ?,
        cta_link = ?,
        position = ?,
        is_active = ?,
        sort_order = ?,
        updated_at = ?
      WHERE id = ?
    `).run(title, subtitle, image, ctaText, ctaLink, position, isActive, sortOrder, now, id);

    return NextResponse.json({
      success: true,
      banner: {
        id,
        title,
        subtitle,
        image,
        ctaText,
        ctaLink,
        position,
        isActive: Boolean(isActive),
        sortOrder,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Banner PUT error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare("DELETE FROM banners WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Banner deleted." });
  } catch (error) {
    console.error("Banner DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}

