import { DEFAULT_BANNERS } from "@/data/banners";
import { Banner } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export const bannerService = {
  getAll(): Banner[] {
    const list = readStorage<Banner[]>(STORAGE_KEYS.BANNERS, DEFAULT_BANNERS);
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getActive(): Banner[] {
    return this.getAll().filter((b) => b.isActive);
  },

  create(input: Omit<Banner, "id">): Banner {
    const current = this.getAll();
    const created: Banner = {
      ...input,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.BANNERS, [...current, created]);
    return created;
  },

  update(id: string, patch: Partial<Omit<Banner, "id">>): Banner | null {
    const current = this.getAll();
    const idx = current.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const updated: Banner = {
      ...current[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    const next = [...current];
    next[idx] = updated;
    writeStorage(STORAGE_KEYS.BANNERS, next);
    return updated;
  },

  remove(id: string): void {
    const next = this.getAll().filter((b) => b.id !== id);
    writeStorage(STORAGE_KEYS.BANNERS, next);
  },
};

