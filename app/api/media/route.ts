import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface MediaRow {
  id: string;
  title: string;
  url: string;
  filename: string | null;
  file_size: number | null;
  mime_type: string | null;
  category: "products" | "banners" | "categories" | "about" | "branding";
  dimensions: string | null;
  created_at: string;
}

function mapRow(r: MediaRow) {
  return {
    id: r.id,
    title: r.title,
    url: r.url,
    category: r.category,
    fileSize: r.file_size || 0,
    mimeType: r.mime_type || "image/jpeg",
    dimensions: r.dimensions || "High Resolution",
    uploadedAt: r.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const db = getDb();

    let query = "SELECT * FROM media WHERE 1=1";
    const params: string[] = [];

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }
    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all(...params) as unknown as MediaRow[];
    return NextResponse.json(rows.map(mapRow));
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, url, category = "products", dimensions = "Original" } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
    }

    const db = getDb();
    const id = `media-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO media (id, title, url, filename, file_size, mime_type, category, dimensions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, url, url.split("/").pop() || "image", 0, "image/jpeg", category, dimensions, now);

    return NextResponse.json({
      success: true,
      media: {
        id,
        title,
        url,
        category,
        dimensions,
        uploadedAt: now,
      },
    });
  } catch (error) {
    console.error("Media POST error:", error);
    return NextResponse.json({ error: "Failed to add media record" }, { status: 500 });
  }
}

