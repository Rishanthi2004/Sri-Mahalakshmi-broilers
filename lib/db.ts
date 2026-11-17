import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_BANNERS } from "@/data/banners";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { DEFAULT_ENQUIRIES, DEFAULT_MEDIA, ENQUIRY_TRANSLATIONS } from "@/data/enquiries";
import { DEFAULT_PRODUCTS } from "@/data/products";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";

// Password hashing helper using scrypt
export function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString("hex")
): string {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

interface InMemUser {
  [key: string]: unknown;
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "super_admin" | "staff_admin";
  is_active: number;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface InMemCategory {
  [key: string]: unknown;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface InMemProduct {
  [key: string]: unknown;
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  gallery_images: string;
  availability: string;
  is_featured: number;
  is_active: number;
  is_deleted: number;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface InMemBanner {
  [key: string]: unknown;
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  cta_text: string | null;
  cta_link: string | null;
  position: "hero_main" | "promo_strip" | "offer_popup";
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface InMemMedia {
  [key: string]: unknown;
  id: string;
  title: string;
  url: string;
  filename: string;
  file_size: number;
  mime_type: string;
  category: string;
  dimensions: string;
  created_at: string;
}

interface InMemEnquiry {
  [key: string]: unknown;
  id: string;
  customer_name: string;
  customer_name_en?: string;
  phone_number: string;
  message: string;
  message_en?: string;
  status: string;
  submitted_at: string;
}

interface InMemSession {
  [key: string]: unknown;
  token: string;
  user_id: string;
  role: string;
  expires_at: string;
  created_at: string;
}

interface InMemoryStore {
  users: InMemUser[];
  categories: InMemCategory[];
  products: InMemProduct[];
  banners: InMemBanner[];
  media: InMemMedia[];
  content: Record<string, string>;
  enquiries: InMemEnquiry[];
  sessions: InMemSession[];
}

function createInitialStore(): InMemoryStore {
  const now = new Date().toISOString();

  return {
    users: [
      {
        id: "user-superadmin",
        name: "ராஜேஷ் நாயர் (உரிமையாளர்)",
        email: "admin@greenpasture.com",
        password_hash: hashPassword("Admin@12345"),
        role: "super_admin",
        is_active: 1,
        last_login_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: "user-staff",
        name: "பூஜா சர்மா (பணியாளர்)",
        email: "staff@greenpasture.com",
        password_hash: hashPassword("Staff@12345"),
        role: "staff_admin",
        is_active: 1,
        last_login_at: now,
        created_at: now,
        updated_at: now,
      },
    ],
    categories: DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      is_active: c.isActive ? 1 : 0,
      sort_order: c.sortOrder,
      created_at: now,
      updated_at: now,
    })),
    products: DEFAULT_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.categoryId,
      description: p.description,
      price: p.price,
      unit: p.unit,
      image: p.image,
      gallery_images: JSON.stringify(p.galleryImages || [p.image]),
      availability: p.availability,
      is_featured: p.isFeatured ? 1 : 0,
      is_active: p.isActive ? 1 : 0,
      is_deleted: 0,
      deleted_at: null,
      created_at: p.createdAt || now,
      updated_at: p.updatedAt || now,
    })),
    banners: DEFAULT_BANNERS.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || null,
      image: b.image,
      cta_text: b.ctaText || null,
      cta_link: b.ctaLink || null,
      position: b.position,
      is_active: b.isActive ? 1 : 0,
      sort_order: b.sortOrder,
      created_at: b.createdAt || now,
      updated_at: b.updatedAt || now,
    })),
    media: DEFAULT_MEDIA.map((m) => ({
      id: m.id,
      title: m.title,
      url: m.url,
      filename: m.title,
      file_size: 150000,
      mime_type: "image/jpeg",
      category: m.category,
      dimensions: m.dimensions || "1200x800",
      created_at: m.uploadedAt || now,
    })),
    content: {
      website_content: JSON.stringify(DEFAULT_WEBSITE_CONTENT),
    },
    enquiries: DEFAULT_ENQUIRIES.map((e) => ({
      id: e.id,
      customer_name: e.customerName,
      customer_name_en: e.customerNameEn || ENQUIRY_TRANSLATIONS[e.id]?.nameEn || e.customerName,
      phone_number: e.phoneNumber,
      message: e.message,
      message_en: e.messageEn || ENQUIRY_TRANSLATIONS[e.id]?.messageEn || e.message,
      status: e.status,
      submitted_at: e.submittedAt || now,
    })),
    sessions: [],
  };
}

declare global {
  var __chickenshop_store: InMemoryStore | undefined;
}

const DB_FILE_PATH = path.join(process.cwd(), "data", "db-store.json");

function loadPersistedStore(): InMemoryStore | null {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data) as InMemoryStore;
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load persisted store from disk:", err);
  }
  return null;
}

function persistStore(store: InMemoryStore) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist store to disk:", err);
  }
}

export function getDb() {
  if (!global.__chickenshop_store) {
    const loaded = loadPersistedStore();
    if (loaded) {
      global.__chickenshop_store = loaded;
    } else {
      global.__chickenshop_store = createInitialStore();
      persistStore(global.__chickenshop_store);
    }
  }
  const store = global.__chickenshop_store;

  return {
    exec() {
      // No-op for schema definitions in in-memory mode
    },

    prepare(sql: string) {
      const trimmed = sql.trim();
      const lower = trimmed.toLowerCase();

      return {
        get(
          ...params: (string | number | boolean | null | undefined)[]
        ): Record<string, unknown> | undefined {
          // --- SESSIONS ---
          if (lower.includes("from sessions s join users u")) {
            const token = String(params[0] || "");
            const now = String(params[1] || new Date().toISOString());
            const session = store.sessions.find(
              (s) => s.token === token && s.expires_at > now
            );
            if (!session) return undefined;
            const user = store.users.find(
              (u) => u.id === session.user_id && u.is_active === 1
            );
            if (!user) return undefined;
            return {
              token: session.token,
              expires_at: session.expires_at,
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              is_active: user.is_active,
              last_login_at: user.last_login_at || null,
            };
          }

          // --- USERS ---
          if (lower.startsWith("select") && lower.includes("from users")) {
            if (lower.includes("count(*)")) {
              const count = store.users.filter(
                (u) => u.role === "super_admin" && u.is_active === 1
              ).length;
              return { c: count, count };
            }
            if (lower.includes("lower(email) = ?") || lower.includes("where lower(email)")) {
              const email = String(params[0] || "").toLowerCase();
              return store.users.find(
                (u) => u.email.toLowerCase() === email || u.id.toLowerCase() === email
              );
            }
            if (lower.includes("where id = ?")) {
              const id = String(params[0] || "");
              return store.users.find((u) => u.id === id);
            }
            return store.users[0];
          }

          // --- CONTENT ---
          if (lower.startsWith("select") && lower.includes("from content")) {
            const key = params[0] ? String(params[0]) : "website_content";
            const val = store.content[key];
            return val ? { value: val } : undefined;
          }

          // --- STATS / COUNTS ---
          if (lower.includes("count(*)")) {
            if (lower.includes("from products")) {
              if (lower.includes("is_deleted = 1")) {
                const count = store.products.filter((p) => p.is_deleted === 1).length;
                return { c: count, count };
              }
              if (lower.includes("is_active = 1")) {
                const count = store.products.filter(
                  (p) => p.is_deleted === 0 && p.is_active === 1
                ).length;
                return { c: count, count };
              }
              if (lower.includes("is_active = 0")) {
                const count = store.products.filter(
                  (p) => p.is_deleted === 0 && p.is_active === 0
                ).length;
                return { c: count, count };
              }
              if (lower.includes("availability = 'out_of_stock'")) {
                const count = store.products.filter(
                  (p) => p.is_deleted === 0 && p.availability === "out_of_stock"
                ).length;
                return { c: count, count };
              }
              const count = store.products.filter((p) => p.is_deleted === 0).length;
              return { c: count, count };
            }
            if (lower.includes("from categories")) {
              const count = store.categories.filter((c) => c.is_active === 1).length;
              return { c: count, count };
            }
            if (lower.includes("from enquiries")) {
              if (lower.includes("status = 'new'")) {
                const count = store.enquiries.filter((e) => e.status === "new").length;
                return { c: count, count };
              }
              const count = store.enquiries.length;
              return { c: count, count };
            }
            if (lower.includes("from banners")) {
              const count = store.banners.length;
              return { c: count, count };
            }
            if (lower.includes("from media")) {
              const count = store.media.length;
              return { c: count, count };
            }
          }

          // --- SINGLE ITEM LOOKUPS BY ID ---
          if (lower.includes("from categories where id = ?")) {
            const id = String(params[0] || "");
            return store.categories.find((c) => c.id === id);
          }
          if (lower.includes("from products where id = ?")) {
            const id = String(params[0] || "");
            return store.products.find((p) => p.id === id);
          }
          if (lower.includes("from banners where id = ?")) {
            const id = String(params[0] || "");
            return store.banners.find((b) => b.id === id);
          }
          if (lower.includes("from media where id = ?")) {
            const id = String(params[0] || "");
            return store.media.find((m) => m.id === id);
          }
          if (lower.includes("from enquiries where id = ?")) {
            const id = String(params[0] || "");
            return store.enquiries.find((e) => e.id === id);
          }

          return undefined;
        },

        all(
          ...params: (string | number | boolean | null | undefined)[]
        ): Record<string, unknown>[] {
          // --- OUT OF STOCK ITEMS IN STATS ---
          if (lower.includes("from products p") && lower.includes("left join categories")) {
            const outOfStock = store.products.filter(
              (p) => p.is_deleted === 0 && p.availability === "out_of_stock"
            );
            return outOfStock.map((p) => {
              const cat = store.categories.find((c) => c.id === p.category_id);
              return {
                id: p.id,
                name: p.name,
                price: p.price,
                unit: p.unit,
                image: p.image,
                category_name: cat ? cat.name : null,
              };
            });
          }
          // --- PRODUCTS ---
          if (lower.includes("from products")) {
            let res = [...store.products];
            if (lower.includes("is_deleted = 1")) {
              res = res.filter((p) => p.is_deleted === 1);
            } else if (lower.includes("is_deleted = 0")) {
              res = res.filter((p) => p.is_deleted === 0);
            }
            if (lower.includes("is_active = 1")) {
              res = res.filter((p) => p.is_active === 1);
            } else if (lower.includes("is_active = 0")) {
              res = res.filter((p) => p.is_active === 0);
            }
            if (lower.includes("is_featured = 1")) {
              res = res.filter((p) => p.is_featured === 1);
            }
            if (lower.includes("category_id = ?")) {
              const catParam = params.find(
                (pr) => typeof pr === "string" && pr.startsWith("cat-")
              );
              if (catParam) {
                res = res.filter((p) => p.category_id === catParam);
              }
            }
            if (lower.includes("availability = ?")) {
              const availParam = params.find(
                (pr) => pr === "available" || pr === "out_of_stock"
              );
              if (availParam) {
                res = res.filter((p) => p.availability === availParam);
              }
            }
            if (lower.includes("like ?")) {
              const searchParam = params.find(
                (pr) => typeof pr === "string" && pr.startsWith("%") && pr.endsWith("%")
              );
              if (searchParam && typeof searchParam === "string") {
                const term = searchParam.replace(/%/g, "").toLowerCase();
                res = res.filter(
                  (p) =>
                    p.name.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term)
                );
              }
            }
            return res;
          }

          // --- CATEGORIES ---
          if (lower.includes("from categories")) {
            if (lower.includes("is_active = 1")) {
              return store.categories
                .filter((c) => c.is_active === 1)
                .sort((a, b) => a.sort_order - b.sort_order);
            }
            return [...store.categories].sort((a, b) => a.sort_order - b.sort_order);
          }

          // --- BANNERS ---
          if (lower.includes("from banners")) {
            if (lower.includes("is_active = 1")) {
              return store.banners
                .filter((b) => b.is_active === 1)
                .sort((a, b) => a.sort_order - b.sort_order);
            }
            return [...store.banners].sort((a, b) => a.sort_order - b.sort_order);
          }

          // --- MEDIA ---
          if (lower.includes("from media")) {
            if (params[0]) {
              const cat = String(params[0]);
              return store.media.filter((m) => m.category === cat);
            }
            return store.media;
          }

          // --- ENQUIRIES ---
          if (lower.includes("from enquiries")) {
            if (lower.includes("limit")) {
              return store.enquiries.slice(0, 5);
            }
            return store.enquiries;
          }

          // --- USERS ---
          if (lower.includes("from users")) {
            return store.users;
          }

          return [];
        },

        run(...params: (string | number | boolean | null | undefined)[]) {
          const now = new Date().toISOString();

          // --- INSERTS ---
          if (lower.startsWith("insert into users")) {
            store.users.push({
              id: String(params[0] || `user-${Date.now()}`),
              name: String(params[1] || ""),
              email: String(params[2] || ""),
              password_hash: String(params[3] || hashPassword("Admin@12345")),
              role: (params[4] as "super_admin" | "staff_admin") || "staff_admin",
              is_active: 1,
              created_at: now,
              updated_at: now,
            });
          } else if (lower.startsWith("insert into categories")) {
            store.categories.push({
              id: String(params[0] || `cat-${Date.now()}`),
              name: String(params[1] || ""),
              slug: String(params[2] || ""),
              description: String(params[3] || ""),
              image: String(params[4] || ""),
              is_active: Number(params[5] ?? 1),
              sort_order: Number(params[6] ?? 1),
              created_at: now,
              updated_at: now,
            });
          } else if (lower.startsWith("insert into products")) {
            store.products.unshift({
              id: String(params[0] || `prod-${Date.now()}`),
              name: String(params[1] || ""),
              slug: String(params[2] || ""),
              category_id: String(params[3] || ""),
              description: String(params[4] || ""),
              price: Number(params[5] || 0),
              unit: String(params[6] || "1 கிலோ"),
              image: String(params[7] || ""),
              gallery_images: String(params[8] || "[]"),
              availability: String(params[9] || "available"),
              is_featured: Number(params[10] ?? 0),
              is_active: Number(params[11] ?? 1),
              is_deleted: 0,
              created_at: now,
              updated_at: now,
            });
          } else if (lower.startsWith("insert into banners")) {
            store.banners.push({
              id: String(params[0] || `banner-${Date.now()}`),
              title: String(params[1] || ""),
              subtitle: params[2] ? String(params[2]) : null,
              image: String(params[3] || ""),
              cta_text: params[4] ? String(params[4]) : null,
              cta_link: params[5] ? String(params[5]) : null,
              position: (params[6] as "hero_main" | "promo_strip" | "offer_popup") || "hero_main",
              is_active: 1,
              sort_order: Number(params[7] ?? 1),
              created_at: now,
              updated_at: now,
            });
          } else if (lower.startsWith("insert into media")) {
            store.media.unshift({
              id: String(params[0] || `media-${Date.now()}`),
              title: String(params[1] || ""),
              url: String(params[2] || ""),
              filename: String(params[3] || ""),
              file_size: Number(params[4] || 150000),
              mime_type: String(params[5] || "image/jpeg"),
              category: String(params[6] || "products"),
              dimensions: String(params[7] || "1200x800"),
              created_at: now,
            });
          } else if (lower.startsWith("insert into content")) {
            store.content["website_content"] = String(params[0] || "");
          } else if (lower.startsWith("insert into enquiries")) {
            store.enquiries.unshift({
              id: String(params[0] || `enq-${Date.now()}`),
              customer_name: String(params[1] || ""),
              phone_number: String(params[2] || ""),
              message: String(params[3] || ""),
              status: String(params[4] || "new"),
              submitted_at: now,
            });
          } else if (lower.startsWith("insert into sessions")) {
            store.sessions.push({
              token: String(params[0] || ""),
              user_id: String(params[1] || ""),
              role: String(params[2] || "super_admin"),
              expires_at: String(params[3] || ""),
              created_at: String(params[4] || now),
            });
          }

          // --- DELETES ---
          else if (lower.startsWith("delete from sessions")) {
            if (lower.includes("where token = ?")) {
              const token = String(params[0] || "");
              store.sessions = store.sessions.filter((s) => s.token !== token);
            } else if (lower.includes("where expires_at < ?")) {
              const exp = String(params[0] || "");
              store.sessions = store.sessions.filter((s) => s.expires_at >= exp);
            }
          } else if (lower.startsWith("delete from users")) {
            const id = String(params[0] || "");
            store.users = store.users.filter((u) => u.id !== id);
          } else if (lower.startsWith("delete from categories")) {
            const id = String(params[0] || "");
            store.categories = store.categories.filter((c) => c.id !== id);
          } else if (lower.startsWith("delete from products")) {
            const id = String(params[0] || "");
            store.products = store.products.filter((p) => p.id !== id);
          } else if (lower.startsWith("delete from banners")) {
            const id = String(params[0] || "");
            store.banners = store.banners.filter((b) => b.id !== id);
          } else if (lower.startsWith("delete from media")) {
            const id = String(params[0] || "");
            store.media = store.media.filter((m) => m.id !== id);
          } else if (lower.startsWith("delete from enquiries")) {
            const id = String(params[0] || "");
            store.enquiries = store.enquiries.filter((e) => e.id !== id);
          }

          // --- UPDATES ---
          else if (lower.startsWith("update products set is_deleted = 1") || (lower.startsWith("update products set") && lower.includes("is_deleted = 1"))) {
            const id = String(params[1] || params[params.length - 1] || "");
            const p = store.products.find((prod) => prod.id === id);
            if (p) {
              p.is_deleted = 1;
              p.deleted_at = String(params[0] || now);
              p.updated_at = String(params[0] || now);
            }
            persistStore(store);
          } else if (lower.startsWith("update products set is_deleted = 0") || (lower.startsWith("update products") && lower.includes("is_deleted = 0"))) {
            const id = String(params[1] || params[params.length - 1] || "");
            const p = store.products.find((prod) => prod.id === id);
            if (p) {
              p.is_deleted = 0;
              p.deleted_at = null;
              p.updated_at = String(params[0] || now);
            }
            persistStore(store);
          } else if (lower.startsWith("update products set")) {
            // Full update: name, slug, category_id, description, price, unit, image, gallery_images, availability, is_featured, is_active, updated_at, id
            const id = String(params[12] || params[params.length - 1] || "");
            const p = store.products.find((prod) => prod.id === id);
            if (p) {
              if (params[0] !== undefined) p.name = String(params[0]);
              if (params[1] !== undefined) p.slug = String(params[1]);
              if (params[2] !== undefined) p.category_id = String(params[2]);
              if (params[3] !== undefined) p.description = String(params[3]);
              if (params[4] !== undefined) p.price = Number(params[4]);
              if (params[5] !== undefined) p.unit = String(params[5]);
              if (params[6] !== undefined) p.image = String(params[6]);
              if (params[7] !== undefined) p.gallery_images = String(params[7]);
              if (params[8] !== undefined) p.availability = String(params[8]);
              if (params[9] !== undefined) p.is_featured = Number(params[9]);
              if (params[10] !== undefined) p.is_active = Number(params[10]);
              p.updated_at = String(params[11] || now);
            }
            persistStore(store);
          } else if (lower.startsWith("update enquiries set status = ?")) {
            const status = String(params[0] || "new");
            const id = String(params[1] || "");
            const enq = store.enquiries.find((e) => e.id === id);
            if (enq) enq.status = status;
            persistStore(store);
          }

          // Persist store on insert and delete actions too
          if (lower.startsWith("insert into") || lower.startsWith("delete from")) {
            persistStore(store);
          }

          return { changes: 1 };
        },
      };
    },
  };
}
