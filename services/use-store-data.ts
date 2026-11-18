"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_BANNERS } from "@/data/banners";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { DEFAULT_ENQUIRIES, DEFAULT_MEDIA } from "@/data/enquiries";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { bannerService } from "./banner-service";
import { categoryService } from "./category-service";
import { contentService } from "./content-service";
import { enquiryService, mediaService } from "./media-enquiry-service";
import { productService } from "./product-service";
import { STORE_UPDATE_EVENT, STORAGE_KEYS, writeStorage } from "./storage";
import { Banner, Category, Enquiry, MediaItem, Product, WebsiteContent } from "@/types";

export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    // 1. Immediate sync from local storage / cache
    const cached = contentService.get();
    setContent(cached);
    setReady(true);

    // 2. Fetch from backend API
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const live = await res.json();
        if (JSON.stringify(live) !== JSON.stringify(cached)) {
          setContent(live);
        }
        writeStorage(STORAGE_KEYS.CONTENT, live, false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { content, ready, reload };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const hasLoadedRef = useRef(false);

  const reload = useCallback(async () => {
    // 1. Instant optimistic load from client cache
    const cached = productService.getAll();
    if (cached && cached.length > 0) {
      setProducts(cached.filter((p) => !p.isDeleted));
      hasLoadedRef.current = true;
      setReady(true);
    }

    // 2. Dynamic fetch from server database API
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const live: Product[] = await res.json();
        if (Array.isArray(live)) {
          const activeOnly = live.filter((p) => !p.isDeleted);
          setProducts(activeOnly);
          setError(null);
          // Sync client cache with live server data
          writeStorage(STORAGE_KEYS.PRODUCTS, live, false);
        }
      } else {
        throw new Error("Unable to fetch live products from server database");
      }
    } catch (err: unknown) {
      console.warn("Products API live fetch warning, using cached catalog:", err);
      if (!hasLoadedRef.current && (!cached || cached.length === 0)) {
        setError((err as Error).message || "Failed to load products");
      }
    } finally {
      setLoading(false);
      hasLoadedRef.current = true;
      setReady(true);
    }
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { products, loading, error, ready, reload };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const cached = categoryService.getAll();
    setCategories(cached);
    setReady(true);

    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const live = await res.json();
        if (JSON.stringify(live) !== JSON.stringify(cached)) {
          setCategories(live);
        }
        writeStorage(STORAGE_KEYS.CATEGORIES, live, false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { categories, ready, reload };
}

export function useMediaItems() {
  const [media, setMedia] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const cached = mediaService.getAll();
    setMedia(cached);
    setReady(true);

    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const live = await res.json();
        if (JSON.stringify(live) !== JSON.stringify(cached)) {
          setMedia(live);
        }
        writeStorage(STORAGE_KEYS.MEDIA, live, false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { media, ready, reload };
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(DEFAULT_ENQUIRIES);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const cached = enquiryService.getAll();
    setEnquiries(cached);
    setReady(true);

    try {
      const res = await fetch("/api/enquiries");
      if (res.ok) {
        const live = await res.json();
        if (JSON.stringify(live) !== JSON.stringify(cached)) {
          setEnquiries(live);
        }
        writeStorage(STORAGE_KEYS.ENQUIRIES, live, false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { enquiries, ready, reload };
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [ready, setReady] = useState(false);

  const reload = useCallback(() => {
    setBanners(bannerService.getAll());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  return { banners, ready, reload };
}
