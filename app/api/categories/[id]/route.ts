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
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as CategoryRow | undefined;
    if (!row) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      image: row.image,
      isActive: Boolean(row.is_active),
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error("Category GET error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const existing = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as CategoryRow | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const name = body.name ?? existing.name;
    const slug = body.name ? slugify(body.name) || existing.slug : existing.slug;
    const description = body.description ?? existing.description;
    const image = body.image ?? existing.image;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
    const sortOrder = body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sort_order;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE categories SET
        name = ?,
        slug = ?,
        description = ?,
        image = ?,
        is_active = ?,
        sort_order = ?,
        updated_at = ?
      WHERE id = ?
    `).run(name, slug, description, image, isActive, sortOrder, now, id);

    return NextResponse.json({
      success: true,
      category: {
        id,
        name,
        slug,
        description,
        image,
        isActive: Boolean(isActive),
        sortOrder,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Category PUT error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Check if category exists
    const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(id) as { name: string } | undefined;
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Crucial check: are active products associated with this category?
    const associatedCount = (
      db.prepare(`
        SELECT count(*) as count 
        FROM products 
        WHERE category_id = ? AND is_deleted = 0
      `).get(id) as { count: number }
    ).count;

    if (associatedCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete "${category.name}": there are ${associatedCount} active products associated with it. Please reassign or delete these products first.`,
          associatedCount,
        },
        { status: 400 }
      );
    }

    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: `Category "${category.name}" was successfully deleted.` });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

