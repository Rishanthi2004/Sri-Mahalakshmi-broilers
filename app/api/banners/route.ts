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

function mapRow(r: BannerRow) {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    image: r.image,
    ctaText: r.cta_text || "",
    ctaLink: r.cta_link || "",
    position: r.position,
    isActive: Boolean(r.is_active),
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");
    const activeOnly = searchParams.get("active") === "1";

    const db = getDb();
    let query = "SELECT * FROM banners WHERE 1=1";
    const params: (string | number)[] = [];

    if (position) {
      query += " AND position = ?";
      params.push(position);
    }
    if (activeOnly) {
      query += " AND is_active = 1";
    }
    query += " ORDER BY sort_order ASC, created_at DESC";

    const rows = db.prepare(query).all(...params) as unknown as BannerRow[];
    return NextResponse.json(rows.map(mapRow));
  } catch (error) {
    console.error("Banners GET error:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle = "",
      image,
      ctaText = "Explore Products",
      ctaLink = "/products",
      position = "hero_main",
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!title || !image) {
      return NextResponse.json({ error: "Banner title and image are required." }, { status: 400 });
    }

    const db = getDb();
    const id = `banner-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO banners (id, title, subtitle, image, cta_text, cta_link, position, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      position,
      isActive ? 1 : 0,
      Number(sortOrder),
      now,
      now
    );

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
        sortOrder: Number(sortOrder),
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Banner POST error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

