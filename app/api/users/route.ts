import { NextRequest, NextResponse } from "next/server";
import { getDb, hashPassword } from "@/lib/db";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "staff_admin";
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at
      FROM users
      ORDER BY created_at ASC
    `).all() as unknown as UserRow[];

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        isActive: Boolean(r.is_active),
        lastLoginAt: r.last_login_at || undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }))
    );
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = "staff_admin" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const db = getDb();
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existing = db.prepare("SELECT id FROM users WHERE lower(email) = ?").get(normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: "An admin user with this email already exists." }, { status: 400 });
    }

    const id = `user-${Date.now()}`;
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).run(id, name.trim(), normalizedEmail, passwordHash, role, now, now);

    return NextResponse.json({
      success: true,
      user: {
        id,
        name: name.trim(),
        email: normalizedEmail,
        role,
        isActive: true,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("User POST error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

