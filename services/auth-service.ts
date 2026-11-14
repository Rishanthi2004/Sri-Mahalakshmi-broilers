import { AdminUser } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export const DEMO_CREDENTIALS = {
  superAdmin: {
    username: "admin@greenpasture.com",
    password: "Admin@12345",
    label: "முதன்மை நிர்வாகி (Admin Demo)",
    name: "ராஜேஷ் நாயர் (உரிமையாளர்)",
    role: "super_admin" as const,
  },
  staffAdmin: {
    username: "staff@greenpasture.com",
    password: "Staff@12345",
    label: "பணியாளர் நிர்வாகி (Staff Demo)",
    name: "பூஜா சர்மா (பணியாளர்)",
    role: "staff_admin" as const,
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

  /**
   * Pure Frontend-Only Demo Login
   * Completely bypasses backend & database.
   * No API calls, no network errors, no server 500 errors.
   */
  async login(
    usernameOrEmail: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password?: string
  ): Promise<{ ok: boolean; user?: AdminUser; error?: string }> {
    const normalized = (usernameOrEmail || "").trim().toLowerCase();
    if (!normalized) {
      return { ok: false, error: "பயனர் பெயர் அல்லது மின்னஞ்சலை உள்ளிடவும்." };
    }

    const now = new Date().toISOString();
    let user: AdminUser;

    // Check Staff Demo
    if (
      normalized === DEMO_CREDENTIALS.staffAdmin.username.toLowerCase() ||
      normalized.includes("staff")
    ) {
      user = {
        id: "demo-staff-admin",
        name: DEMO_CREDENTIALS.staffAdmin.name,
        email: DEMO_CREDENTIALS.staffAdmin.username,
        role: "staff_admin",
        isActive: true,
        lastLoginAt: now,
      };
    } else {
      // Default to Super Admin Demo (e.g. admin@greenpasture.com or any admin login)
      user = {
        id: "demo-super-admin",
        name: DEMO_CREDENTIALS.superAdmin.name,
        email:
          normalized === DEMO_CREDENTIALS.superAdmin.username.toLowerCase()
            ? DEMO_CREDENTIALS.superAdmin.username
            : normalized,
        role: "super_admin",
        isActive: true,
        lastLoginAt: now,
      };
    }

    if (typeof window !== "undefined") {
      writeStorage(STORAGE_KEYS.ADMIN_AUTH, user);
    }

    return { ok: true, user };
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  async getProfile(): Promise<AdminUser | null> {
    return this.getSession();
  },
};
