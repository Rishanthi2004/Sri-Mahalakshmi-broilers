import { DEFAULT_PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { readStorage, slugify, STORAGE_KEYS, writeStorage } from "./storage";

/**
 * Product Service (Direct Database API Integration + Client Cache)
 * Connected to Next.js /api/products backend with persistence and live reactivity.
 */
export const productService = {
  /**
   * Synchronous cached retrieval for fast initial renders
   */
  getAll(): Product[] {
    return readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  },

  getActive(): Product[] {
    return this.getAll().filter((p) => p.isActive && !p.isDeleted);
  },

  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },

  /**
   * Fetch live products from backend database API
   */
  async fetchAll(includeDeleted = false): Promise<Product[]> {
    try {
      const url = includeDeleted ? "/api/products?include_deleted=1" : "/api/products";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const live: Product[] = await res.json();
        if (Array.isArray(live)) {
          if (includeDeleted) {
            writeStorage(STORAGE_KEYS.PRODUCTS, live);
          } else {
            const current = this.getAll();
            const deleted = current.filter((p) => p.isDeleted);
            const liveIds = new Set(live.map((p) => p.id));
            const retainedDeleted = deleted.filter((p) => !liveIds.has(p.id));
            writeStorage(STORAGE_KEYS.PRODUCTS, [...live, ...retainedDeleted]);
          }
          return live;
        }
      }
    } catch (err) {
      console.warn("productService.fetchAll API error, falling back to cache:", err);
    }
    return this.getAll();
  },

  /**
   * Create a new product in the database API and sync local state
   */
  async create(
    input: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = new Date().toISOString();
    const tempId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const tempSlug = slugify(input.name) || `product-${Date.now()}`;
    const newProduct: Product = {
      ...input,
      id: tempId,
      slug: tempSlug,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistically update local cache & broadcast store-updated event
    const current = this.getAll();
    writeStorage(STORAGE_KEYS.PRODUCTS, [newProduct, ...current]);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const fresh = this.getAll().map((p) => (p.id === tempId ? data.product : p));
          writeStorage(STORAGE_KEYS.PRODUCTS, fresh);
          return data.product;
        }
      }
    } catch (err) {
      console.error("productService.create API error:", err);
    }

    return newProduct;
  },

  /**
   * Update an existing product in the database API and sync local state
   */
  async update(
    id: string,
    patch: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product | null> {
    const products = this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct: Product = {
      ...products[index],
      ...patch,
      slug: patch.name ? slugify(patch.name) || products[index].slug : products[index].slug,
      updatedAt: new Date().toISOString(),
    };
    const next = [...products];
    next[index] = updatedProduct;
    writeStorage(STORAGE_KEYS.PRODUCTS, next);

    try {
      if (patch.isDeleted === true) {
        // Soft delete endpoint
        await fetch(`/api/products/${id}`, { method: "DELETE" });
      } else if (patch.isDeleted === false) {
        // Restore endpoint
        await fetch(`/api/products/${id}/restore`, { method: "POST" });
      } else {
        // General PUT update
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            const fresh = this.getAll().map((p) => (p.id === id ? data.product : p));
            writeStorage(STORAGE_KEYS.PRODUCTS, fresh);
            return data.product;
          }
        }
      }
    } catch (err) {
      console.error("productService.update API error:", err);
    }

    return updatedProduct;
  },

  /**
   * Permanent removal or force delete from database API
   */
  async remove(id: string, force = true): Promise<void> {
    const products = this.getAll().filter((p) => p.id !== id);
    writeStorage(STORAGE_KEYS.PRODUCTS, products);

    try {
      await fetch(`/api/products/${id}?force=${force ? "1" : "0"}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("productService.remove API error:", err);
    }
  },

  /**
   * Restore a soft-deleted product
   */
  async restore(id: string): Promise<Product | null> {
    return this.update(id, { isDeleted: false, deletedAt: undefined });
  },
};

