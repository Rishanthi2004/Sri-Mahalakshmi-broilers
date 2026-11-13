import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();

    const totalProducts = (
      db.prepare("SELECT count(*) as c FROM products WHERE is_deleted = 0").get() as { c: number }
    ).c;

    const activeProducts = (
      db.prepare("SELECT count(*) as c FROM products WHERE is_deleted = 0 AND is_active = 1").get() as { c: number }
    ).c;

    const inactiveProducts = (
      db.prepare("SELECT count(*) as c FROM products WHERE is_deleted = 0 AND is_active = 0").get() as { c: number }
    ).c;

    const outOfStock = (
      db.prepare("SELECT count(*) as c FROM products WHERE is_deleted = 0 AND availability = 'out_of_stock'").get() as { c: number }
    ).c;

    const softDeleted = (
      db.prepare("SELECT count(*) as c FROM products WHERE is_deleted = 1").get() as { c: number }
    ).c;

    const totalCategories = (
      db.prepare("SELECT count(*) as c FROM categories").get() as { c: number }
    ).c;

    const totalEnquiries = (
      db.prepare("SELECT count(*) as c FROM enquiries").get() as { c: number }
    ).c;

    const newEnquiries = (
      db.prepare("SELECT count(*) as c FROM enquiries WHERE status = 'new'").get() as { c: number }
    ).c;

    const totalBanners = (
      db.prepare("SELECT count(*) as c FROM banners").get() as { c: number }
    ).c;

    const totalMedia = (
      db.prepare("SELECT count(*) as c FROM media").get() as { c: number }
    ).c;

    const recentEnquiries = db.prepare(`
      SELECT id, customer_name, phone_number, message, status, submitted_at
      FROM enquiries
      ORDER BY submitted_at DESC
      LIMIT 5
    `).all() as Array<{
      id: string;
      customer_name: string;
      phone_number: string;
      message: string;
      status: string;
      submitted_at: string;
    }>;

    const outOfStockItems = db.prepare(`
      SELECT p.id, p.name, p.price, p.unit, p.image, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_deleted = 0 AND p.availability = 'out_of_stock'
      LIMIT 5
    `).all() as Array<{
      id: string;
      name: string;
      price: number;
      unit: string;
      image: string;
      category_name: string | null;
    }>;

    return NextResponse.json({
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,
      softDeleted,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      totalBanners,
      totalMedia,
      recentEnquiries: recentEnquiries.map((e) => ({
        id: e.id,
        customerName: e.customer_name,
        phoneNumber: e.phone_number,
        message: e.message,
        status: e.status,
        submittedAt: e.submitted_at,
      })),
      outOfStockItems: outOfStockItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        categoryName: item.category_name || "Uncategorized",
      })),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}

