import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { slugify } from "@/services/storage";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT c.*, 
        (SELECT count(*) FROM products p WHERE p.category_id = c.id AND p.is_deleted = 0) as product_count
      FROM categories c
      ORDER BY c.sort_order ASC, c.created_at ASC
    `).all() as unknown as CategoryRow[];

    const categories = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || "",
      image: r.image,
      isActive: Boolean(r.is_active),
      sortOrder: r.sort_order,
      productCount: r.product_count || 0,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description = "", image, isActive = true, sortOrder = 0 } = body;

    if (!name || !image) {
      return NextResponse.json(
        { error: "Category name and image are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `cat-${slugify(name)}-${Date.now().toString(36)}`;
    const slug = slugify(name) || `cat-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO categories (id, name, slug, description, image, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      slug,
      description,
      image,
      isActive ? 1 : 0,
      Number(sortOrder),
      now,
      now
    );

    return NextResponse.json({
      success: true,
      category: {
        id,
        name,
        slug,
        description,
        image,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder),
        productCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

