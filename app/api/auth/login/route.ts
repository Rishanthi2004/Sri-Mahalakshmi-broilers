import { NextRequest, NextResponse } from "next/server";
import { getDb, verifyPassword } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;
    const identifier = (username || email || "").trim().toLowerCase();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Query user by email, or id, or username prefix
    const user = db.prepare(`
      SELECT id, name, email, password_hash, role, is_active
      FROM users
      WHERE lower(email) = ? OR lower(id) = ? OR (email LIKE ? AND ? = 'admin')
    `).get(identifier, identifier, `${identifier}@%`, identifier) as {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      role: "super_admin" | "staff_admin";
      is_active: number;
    } | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email/username and password." },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "This administrator account is deactivated. Contact store owner." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Update last login timestamp
    const now = new Date().toISOString();
    db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?").run(now, user.id);

    // Create session
    const token = createSession(user.id, user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginAt: now,
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during login." },
      { status: 500 }
    );
  }
}

