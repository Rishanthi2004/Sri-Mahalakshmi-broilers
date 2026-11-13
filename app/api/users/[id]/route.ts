import { NextRequest, NextResponse } from "next/server";
import { getDb, hashPassword } from "@/lib/db";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "staff_admin";
  is_active: number;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name = body.name ?? existing.name;
    const role = body.role ?? existing.role;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
    const now = new Date().toISOString();

    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      const newHash = hashPassword(body.password);
      db.prepare(`
        UPDATE users SET name = ?, role = ?, is_active = ?, password_hash = ?, updated_at = ? WHERE id = ?
      `).run(name, role, isActive, newHash, now, id);
    } else {
      db.prepare(`
        UPDATE users SET name = ?, role = ?, is_active = ?, updated_at = ? WHERE id = ?
      `).run(name, role, isActive, now, id);
    }

    return NextResponse.json({
      success: true,
      message: "Admin user updated successfully.",
    });
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const target = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Safeguard: Check if this is the only super admin
    if (target.role === "super_admin") {
      const superAdminCount = (
        db.prepare("SELECT count(*) as c FROM users WHERE role = 'super_admin' AND is_active = 1").get() as { c: number }
      ).c;
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the only active Super Administrator. Create or promote another super admin first." },
          { status: 400 }
        );
      }
    }

    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: `Admin user ${target.name} removed.` });
  } catch (error) {
    console.error("User DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

