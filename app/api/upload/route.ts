import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { getDb } from "@/lib/db";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "products";
    const customTitle = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported formats: JPG, JPEG, PNG, WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5 MB.` },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const rawExt = path.extname(file.name) || ".jpg";
    const ext = rawExt.toLowerCase();
    const cleanName = path
      .basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .substring(0, 40);

    const filename = `${Date.now()}-${cleanName}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const mediaId = `media-${Date.now()}`;
    const title = customTitle || file.name;
    const now = new Date().toISOString();

    const db = getDb();
    db.prepare(`
      INSERT INTO media (id, title, url, filename, file_size, mime_type, category, dimensions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      mediaId,
      title,
      publicUrl,
      filename,
      file.size,
      file.type,
      category,
      "Optimized",
      now
    );

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: {
        id: mediaId,
        title,
        url: publicUrl,
        filename,
        fileSize: file.size,
        mimeType: file.type,
        category,
        uploadedAt: now,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

