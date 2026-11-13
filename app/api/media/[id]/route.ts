import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import fs from "node:fs/promises";
import path from "node:path";

interface MediaRow {
  id: string;
  title: string;
  url: string;
  filename: string | null;
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

    const media = db.prepare("SELECT * FROM media WHERE id = ?").get(id) as MediaRow | undefined;
    if (!media) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    if (!force) {
      const activeUsages: string[] = [];

      // Check active products
      const products = db.prepare(`
        SELECT name FROM products 
        WHERE is_deleted = 0 AND (image = ? OR gallery_images LIKE ?)
      `).all(media.url, `%${media.url}%`) as { name: string }[];
      if (products.length > 0) {
        activeUsages.push(`Products (${products.slice(0, 3).map((p) => p.name).join(", ")}${products.length > 3 ? "..." : ""})`);
      }

      // Check active categories
      const categories = db.prepare(`
        SELECT name FROM categories WHERE image = ?
      `).all(media.url) as { name: string }[];
      if (categories.length > 0) {
        activeUsages.push(`Categories (${categories.map((c) => c.name).join(", ")})`);
      }

      // Check active banners
      const banners = db.prepare(`
        SELECT title FROM banners WHERE is_active = 1 AND image = ?
      `).all(media.url) as { title: string }[];
      if (banners.length > 0) {
        activeUsages.push(`Active Banners (${banners.map((b) => b.title).join(", ")})`);
      }

      // Check website content
      const contentRow = db.prepare("SELECT value FROM content WHERE key = 'website_content'").get() as { value: string } | undefined;
      if (contentRow && contentRow.value.includes(media.url)) {
        activeUsages.push("Website Content / Branding");
      }

      if (activeUsages.length > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete image: it is currently used in active website sections: ${activeUsages.join("; ")}. Please replace the image in those sections before deleting.`,
            inUse: true,
            activeUsages,
          },
          { status: 400 }
        );
      }
    }

    // Try deleting the physical uploaded file if it resides in /uploads/
    if (media.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", media.url);
        await fs.unlink(filePath);
      } catch {
        // file might not exist or already removed, ignore
      }
    }

    db.prepare("DELETE FROM media WHERE id = ?").run(id);

    return NextResponse.json({
      success: true,
      message: `Image "${media.title}" deleted from media library.`,
    });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
  }
}

