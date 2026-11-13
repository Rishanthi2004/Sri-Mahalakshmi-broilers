import { DEFAULT_PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { readStorage, slugify, STORAGE_KEYS, writeStorage } from "./storage";

/**
 * Product Service (Frontend Demo Implementation)
 * Replace LocalStorage reads/writes with API client calls when connecting a backend.
 */
export const productService = {
  getAll(): Product[] {
    return readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  },

  getActive(): Product[] {
    return this.getAll().filter((p) => p.isActive);
  },

  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },

  create(
    input: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">
  ): Product {
    const products = this.getAll();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...input,
      id: `prod-${Date.now()}`,
      slug: slugify(input.name) || `product-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newProduct, ...products];
    writeStorage(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  },

  update(id: string, patch: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
    const products = this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct: Product = {
      ...products[index],
      ...patch,
      slug: patch.name ? slugify(patch.name) : products[index].slug,
      updatedAt: new Date().toISOString(),
    };
    const next = [...products];
    next[index] = updatedProduct;
    writeStorage(STORAGE_KEYS.PRODUCTS, next);
    return updatedProduct;
  },

  remove(id: string): void {
    const products = this.getAll().filter((p) => p.id !== id);
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  },
};

