export const STORAGE_KEYS = {
  PRODUCTS: "gp_poultry_products_v1",
  CATEGORIES: "gp_poultry_categories_v1",
  CONTENT: "gp_poultry_content_v1",
  MEDIA: "gp_poultry_media_v1",
  ENQUIRIES: "gp_poultry_enquiries_v1",
  BANNERS: "gp_poultry_banners_v1",
  USERS: "gp_poultry_users_v1",
  ADMIN_AUTH: "gp_poultry_admin_session_v1",
} as const;

export const STORE_UPDATE_EVENT = "chickenshop:store-updated";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORE_UPDATE_EVENT, { detail: { key } }));
  } catch (err) {
    // Handle LocalStorage quota exceeded gracefully for large demo uploads
    console.warn("LocalStorage write failed:", err);
  }
}

export function resetAllDemoStorage(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.ADMIN_AUTH) {
      window.localStorage.removeItem(key);
    }
  });
  window.dispatchEvent(new CustomEvent(STORE_UPDATE_EVENT, { detail: { key: "all" } }));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}
