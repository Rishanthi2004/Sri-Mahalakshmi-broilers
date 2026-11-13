import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { DEFAULT_PRODUCTS } from "@/data/products";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { DEFAULT_ENQUIRIES, DEFAULT_MEDIA } from "@/data/enquiries";

const DB_PATH = path.join(process.cwd(), "data", "chickenshop.db");

// Password hashing helper using scrypt
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Global singleton for database connection in Next.js
declare global {
  var __chickenshop_db: DatabaseSync | undefined;
}

export function getDb(): DatabaseSync {
  if (global.__chickenshop_db) {
    return global.__chickenshop_db;
  }

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  initSchema(db);
  seedInitialData(db);

  global.__chickenshop_db = db;
  return db;
}

function initSchema(db: DatabaseSync) {
  // Users table with roles: super_admin, staff_admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff_admin', -- 'super_admin' | 'staff_admin'
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Products table with soft-deletion (is_deleted, deleted_at)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT '1 kg',
      image TEXT NOT NULL,
      gallery_images TEXT NOT NULL DEFAULT '[]',
      availability TEXT NOT NULL DEFAULT 'available', -- 'available' | 'out_of_stock'
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );
  `);

  // Banners table
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      image TEXT NOT NULL,
      cta_text TEXT,
      cta_link TEXT,
      position TEXT NOT NULL DEFAULT 'hero_main', -- 'hero_main' | 'promo_strip'
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Media Library table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      filename TEXT,
      file_size INTEGER DEFAULT 0,
      mime_type TEXT,
      category TEXT NOT NULL DEFAULT 'products', -- 'products' | 'banners' | 'categories' | 'about' | 'branding'
      dimensions TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Key-value Website Content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Enquiries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'resolved'
      submitted_at TEXT NOT NULL
    );
  `);
}

function seedInitialData(db: DatabaseSync) {
  const now = new Date().toISOString();

  // 1. Seed Users (Super Admin & Staff Admin)
  const userCount = (db.prepare("SELECT count(*) as count FROM users").get() as { count: number }).count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `);

    // Super Admin: admin@greenpasture.com / Admin@12345 (also alias admin@greenpasture.demo for demo convenience)
    insertUser.run(
      "user-superadmin",
      "ராஜேஷ் நாயர் (உரிமையாளர்)",
      "admin@greenpasture.com",
      hashPassword("Admin@12345"),
      "super_admin",
      now,
      now
    );

    // Also support demo username
    insertUser.run(
      "user-demo-admin",
      "கடை நிர்வாகி (Admin)",
      "admin@greenpasture.demo",
      hashPassword("Fresh@2026"),
      "super_admin",
      now,
      now
    );

    // Staff Admin: staff@greenpasture.com / Staff@12345
    insertUser.run(
      "user-staff",
      "பூஜா சர்மா (பணியாளர்)",
      "staff@greenpasture.com",
      hashPassword("Staff@12345"),
      "staff_admin",
      now,
      now
    );
  }

  // 2. Seed Categories
  const catCount = (db.prepare("SELECT count(*) as count FROM categories").get() as { count: number }).count;
  if (catCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of DEFAULT_CATEGORIES) {
      insertCat.run(
        c.id,
        c.name,
        c.slug,
        c.description,
        c.image,
        c.isActive ? 1 : 0,
        c.sortOrder,
        now,
        now
      );
    }
  }

  // 3. Seed Products
  const prodCount = (db.prepare("SELECT count(*) as count FROM products").get() as { count: number }).count;
  if (prodCount === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, slug, category_id, description, price, unit, image, gallery_images,
        availability, is_featured, is_active, is_deleted, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    for (const p of DEFAULT_PRODUCTS) {
      insertProd.run(
        p.id,
        p.name,
        p.slug,
        p.categoryId,
        p.description,
        p.price,
        p.unit,
        p.image,
        JSON.stringify(p.galleryImages || [p.image]),
        p.availability,
        p.isFeatured ? 1 : 0,
        p.isActive ? 1 : 0,
        p.createdAt || now,
        p.updatedAt || now
      );
    }
  }

  // 4. Seed Banners
  const bannerCount = (db.prepare("SELECT count(*) as count FROM banners").get() as { count: number }).count;
  if (bannerCount === 0) {
    const insertBanner = db.prepare(`
      INSERT INTO banners (id, title, subtitle, image, cta_text, cta_link, position, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `);
    insertBanner.run(
      "banner-1",
      "தினமும் காலையில் சுகாதாரமாக வெட்டப்பட்ட புதிய கோழிக்கறி",
      "மென்மையான கறிக்கட், கொழுப்பற்ற எலும்பில்லா நெஞ்சுக்கறி முதல் பண்ணை முட்டைகள் வரை — உங்கள் தேவைக்கேற்ப சுத்தமாக வெட்டித் தருகிறோம்.",
      "/images/hero-banner.jpg",
      "பொருட்களைப் பார்க்க",
      "/products",
      "hero_main",
      1,
      now,
      now
    );
    insertBanner.run(
      "banner-2",
      "வார இறுதி சிறப்பு: பண்ணை நாட்டுக்கோழி கறிக்கட்",
      "பாரம்பரிய சுவையும் தரமும் கொண்ட நாட்டுக்கோழி ஒவ்வொரு சனி & ஞாயிறு காலை கிடைக்கும்.",
      "/images/float-whole-chicken.png",
      "வாட்ஸ்அப்பில் ஆர்டர்",
      "/products",
      "promo_strip",
      2,
      now,
      now
    );
  }

  // 5. Seed Media
  const mediaCount = (db.prepare("SELECT count(*) as count FROM media").get() as { count: number }).count;
  if (mediaCount === 0) {
    const insertMedia = db.prepare(`
      INSERT INTO media (id, title, url, filename, file_size, mime_type, category, dimensions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of DEFAULT_MEDIA) {
      insertMedia.run(
        m.id,
        m.title,
        m.url,
        path.basename(m.url),
        150000,
        "image/jpeg",
        m.category,
        m.dimensions || "1200x800",
        m.uploadedAt || now
      );
    }
  }

  // 6. Seed Website Content (stored as JSON under 'website_content')
  const contentRow = db.prepare("SELECT value FROM content WHERE key = 'website_content'").get();
  if (!contentRow) {
    db.prepare(`
      INSERT INTO content (key, value, updated_at) VALUES ('website_content', ?, ?)
    `).run(JSON.stringify(DEFAULT_WEBSITE_CONTENT), now);
  }

  // 7. Seed Enquiries
  const enqCount = (db.prepare("SELECT count(*) as count FROM enquiries").get() as { count: number }).count;
  if (enqCount === 0) {
    const insertEnq = db.prepare(`
      INSERT INTO enquiries (id, customer_name, phone_number, message, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const e of DEFAULT_ENQUIRIES) {
      insertEnq.run(e.id, e.customerName, e.phoneNumber, e.message, e.status, e.submittedAt || now);
    }
  }
}
