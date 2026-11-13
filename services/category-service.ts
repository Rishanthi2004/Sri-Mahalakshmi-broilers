import { DEFAULT_CATEGORIES } from "@/data/categories";
import { Category } from "@/types";
import { readStorage, slugify, STORAGE_KEYS, writeStorage } from "./storage";

/**
 * Category Service (Frontend Demo Implementation)
 * Replace LocalStorage reads/writes with backend endpoints later without UI changes.
 */
export const categoryService = {
  getAll(): Category[] {
    const items = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getActive(): Category[] {
    return this.getAll().filter((c) => c.isActive);
  },

  create(input: Omit<Category, "id" | "slug" | "sortOrder">): Category {
    const current = this.getAll();
    const maxOrder = current.reduce((max, c) => Math.max(max, c.sortOrder), 0);
    const created: Category = {
      ...input,
      id: `cat-${Date.now()}`,
      slug: slugify(input.name) || `category-${Date.now()}`,
      sortOrder: maxOrder + 1,
    };
    writeStorage(STORAGE_KEYS.CATEGORIES, [...current, created]);
    return created;
  },

  update(id: string, patch: Partial<Omit<Category, "id">>): Category | null {
    const current = this.getAll();
    const idx = current.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated: Category = {
      ...current[idx],
      ...patch,
      slug: patch.name ? slugify(patch.name) : current[idx].slug,
    };
    const next = [...current];
    next[idx] = updated;
    writeStorage(STORAGE_KEYS.CATEGORIES, next);
    return updated;
  },

  remove(id: string): void {
    const remaining = this.getAll()
      .filter((c) => c.id !== id)
      .map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
    writeStorage(STORAGE_KEYS.CATEGORIES, remaining);
  },

  move(id: string, direction: "up" | "down"): Category[] {
    const current = this.getAll();
    const idx = current.findIndex((c) => c.id === id);
    if (idx === -1) return current;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return current;

    const swapped = [...current];
    const [moved] = swapped.splice(idx, 1);
    swapped.splice(targetIdx, 0, moved);

    const reindexed = swapped.map((c, i) => ({ ...c, sortOrder: i + 1 }));
    writeStorage(STORAGE_KEYS.CATEGORIES, reindexed);
    return reindexed;
  },
};

