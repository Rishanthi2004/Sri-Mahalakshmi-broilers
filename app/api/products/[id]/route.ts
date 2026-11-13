import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { slugify } from "@/services/storage";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  price: number;
  unit: string;
  image: string;
  gallery_images: string;
  availability: "available" | "out_of_stock";
  is_featured: number;
  is_active: number;
  is_deleted: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToProduct(r: ProductRow) {
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(r.gallery_images || "[]");
  } catch {
    gallery = [r.image];
  }
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    categoryId: r.category_id,
    description: r.description || "",
    price: r.price,
    unit: r.unit,
    image: r.image,
    galleryImages: gallery.length > 0 ? gallery : [r.image],
    availability: r.availability,
    isFeatured: Boolean(r.is_featured),
    isActive: Boolean(r.is_active),
    isDeleted: Boolean(r.is_deleted),
    deletedAt: r.deleted_at || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as unknown as ProductRow | undefined;
    if (!row) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(mapRowToProduct(row));
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
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

    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as unknown as ProductRow | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const name = body.name ?? existing.name;
    const slug = body.name ? slugify(body.name) || existing.slug : existing.slug;
    const categoryId = body.categoryId ?? existing.category_id;
    const description = body.description ?? existing.description;
    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const unit = body.unit ?? existing.unit;
    const image = body.image ?? existing.image;
    const galleryImages = body.galleryImages !== undefined ? JSON.stringify(body.galleryImages) : existing.gallery_images;
    const availability = body.availability ?? existing.availability;
    const isFeatured = body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : existing.is_featured;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE products SET
        name = ?,
        slug = ?,
        category_id = ?,
        description = ?,
        price = ?,
        unit = ?,
        image = ?,
        gallery_images = ?,
        availability = ?,
        is_featured = ?,
        is_active = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      name,
      slug,
      categoryId,
      description,
      price,
      unit,
      image,
      galleryImages,
      availability,
      isFeatured,
      isActive,
      now,
      id
    );

    const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as unknown as ProductRow;
    return NextResponse.json({ success: true, product: mapRowToProduct(updated) });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";
    const db = getDb();

    if (force) {
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      return NextResponse.json({ success: true, message: "Product permanently removed." });
    }

    // Soft delete
    const now = new Date().toISOString();
    db.prepare("UPDATE products SET is_deleted = 1, deleted_at = ? WHERE id = ?").run(now, id);

    return NextResponse.json({
      success: true,
      message: "Product soft-deleted. It can be recovered anytime from the Trash tab.",
    });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

