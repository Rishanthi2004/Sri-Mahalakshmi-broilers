import { AdminUser } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export const DEFAULT_USERS: AdminUser[] = [
  {
    id: "user-superadmin",
    name: "ராஜேஷ் நாயர் (உரிமையாளர்)",
    email: "admin@greenpasture.com",
    role: "super_admin",
    isActive: true,
    lastLoginAt: "2026-11-13T08:30:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-staff",
    name: "பூஜா சர்மா (பணியாளர்)",
    email: "staff@greenpasture.com",
    role: "staff_admin",
    isActive: true,
    lastLoginAt: "2026-11-13T09:15:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export const userService = {
  getAll(): AdminUser[] {
    return readStorage<AdminUser[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },

  create(input: Omit<AdminUser, "id" | "createdAt">): AdminUser {
    const current = this.getAll();
    const created: AdminUser = {
      ...input,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.USERS, [...current, created]);
    return created;
  },

  update(id: string, patch: Partial<Omit<AdminUser, "id">>): AdminUser | null {
    const current = this.getAll();
    const idx = current.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const updated: AdminUser = {
      ...current[idx],
      ...patch,
    };
    const next = [...current];
    next[idx] = updated;
    writeStorage(STORAGE_KEYS.USERS, next);
    return updated;
  },

  remove(id: string): void {
    const next = this.getAll().filter((u) => u.id !== id);
    writeStorage(STORAGE_KEYS.USERS, next);
  },
};

