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

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const availability = searchParams.get("availability") || "";
    const status = searchParams.get("status") || "";
    const includeDeleted = searchParams.get("include_deleted") === "1";
    const onlyDeleted = searchParams.get("only_deleted") === "1";
    const featuredOnly = searchParams.get("featured") === "1";

    let query = "SELECT * FROM products WHERE 1=1";
    const params: (string | number)[] = [];

    if (onlyDeleted) {
      query += " AND is_deleted = 1";
    } else if (!includeDeleted) {
      query += " AND is_deleted = 0";
    }

    if (search) {
      query += " AND (lower(name) LIKE ? OR lower(description) LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== "all") {
      query += " AND category_id = ?";
      params.push(category);
    }

    if (availability && availability !== "all") {
      query += " AND availability = ?";
      params.push(availability);
    }

    if (status === "active") {
      query += " AND is_active = 1";
    } else if (status === "inactive") {
      query += " AND is_active = 0";
    }

    if (featuredOnly) {
      query += " AND is_featured = 1";
    }

    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all(...params) as unknown as ProductRow[];
    return NextResponse.json(rows.map(mapRowToProduct));
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      description = "",
      price,
      unit = "1 kg",
      image,
      galleryImages = [],
      availability = "available",
      isFeatured = false,
      isActive = true,
    } = body;

    if (!name || !categoryId || price === undefined || !image) {
      return NextResponse.json(
        { error: "Product name, category, price and main image are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const baseSlug = slugify(name) || `prod-${Date.now()}`;
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;
    const now = new Date().toISOString();
    const galleryJson = JSON.stringify(galleryImages.length > 0 ? galleryImages : [image]);

    db.prepare(`
      INSERT INTO products (
        id, name, slug, category_id, description, price, unit, image, gallery_images,
        availability, is_featured, is_active, is_deleted, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      id,
      name,
      slug,
      categoryId,
      description,
      Number(price),
      unit,
      image,
      galleryJson,
      availability,
      isFeatured ? 1 : 0,
      isActive ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({
      success: true,
      product: {
        id,
        name,
        slug,
        categoryId,
        description,
        price: Number(price),
        unit,
        image,
        galleryImages: galleryImages.length > 0 ? galleryImages : [image],
        availability,
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive),
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

