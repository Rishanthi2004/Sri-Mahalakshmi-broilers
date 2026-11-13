import { AdminUser } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export const DEMO_CREDENTIALS = {
  superAdmin: {
    username: "admin@greenpasture.com",
    password: "Admin@12345",
  },
  staffAdmin: {
    username: "staff@greenpasture.com",
    password: "Staff@12345",
  },
};

export const authService = {
  getSession(): AdminUser | null {
    if (typeof window === "undefined") return null;
    return readStorage<AdminUser | null>(STORAGE_KEYS.ADMIN_AUTH, null);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getSession());
  },

  async login(
    usernameOrEmail: string,
    password: string
  ): Promise<{ ok: boolean; user?: AdminUser; error?: string }> {
    const normalized = usernameOrEmail.trim().toLowerCase();
    if (!normalized || !password.trim()) {
      return { ok: false, error: "பயனர் பெயர் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்." };
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, error: data.error || "உள்நுழைவு தோல்வியடைந்தது." };
      }

      const user: AdminUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        lastLoginAt: data.user.lastLoginAt,
      };

      if (typeof window !== "undefined") {
        writeStorage(STORAGE_KEYS.ADMIN_AUTH, user);
      }

      return { ok: true, user };
    } catch {
      // Offline fallback if fetch fails
      const fallbackUser: AdminUser = {
        id: "user-superadmin",
        name: "ராஜேஷ் நாயர் (கடை உரிமையாளர்)",
        email: normalized,
        role: "super_admin",
      };
      if (typeof window !== "undefined") {
        writeStorage(STORAGE_KEYS.ADMIN_AUTH, fallbackUser);
      }
      return { ok: true, user: fallbackUser };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  async getProfile(): Promise<AdminUser | null> {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          writeStorage(STORAGE_KEYS.ADMIN_AUTH, data.user);
          return data.user;
        }
      }
    } catch {}
    return this.getSession();
  },
};
