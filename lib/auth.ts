import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { getDb } from "./db";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "staff_admin";
  isActive: boolean;
  lastLoginAt?: string;
}

export function createSession(userId: string, role: string): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  // Clean up any old expired sessions first
  try {
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now);
  } catch {}

  db.prepare(`
    INSERT INTO sessions (token, user_id, role, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(token, userId, role, expiresAt, now);

  return token;
}

export function deleteSession(token: string) {
  if (!token) return;
  const db = getDb();
  try {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  } catch {}
}

export function getUserFromToken(token: string): SessionUser | null {
  if (!token) return null;
  const db = getDb();
  const now = new Date().toISOString();

  try {
    const row = db.prepare(`
      SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role, u.is_active, u.last_login_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > ? AND u.is_active = 1
    `).get(token, now) as {
      id: string;
      name: string;
      email: string;
      role: "super_admin" | "staff_admin";
      is_active: number;
      last_login_at: string | null;
    } | undefined;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      isActive: Boolean(row.is_active),
      lastLoginAt: row.last_login_at || undefined,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return getUserFromToken(token);
}

export function getSessionFromRequest(req: NextRequest): SessionUser | null {
  const authHeader = req.headers.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("admin_session")?.value || "";
  }
  return getUserFromToken(token);
}

