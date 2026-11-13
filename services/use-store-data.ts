"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { DEFAULT_ENQUIRIES, DEFAULT_MEDIA } from "@/data/enquiries";
import { DEFAULT_PRODUCTS } from "@/data/products";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
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
    setContent(contentService.get());
    setReady(true);

    // 2. Fetch from backend API
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const live = await res.json();
        setContent(live);
        writeStorage(STORAGE_KEYS.CONTENT, live);
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
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    setProducts(productService.getAll());
    setReady(true);

    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const live = await res.json();
        setProducts(live);
        writeStorage(STORAGE_KEYS.PRODUCTS, live);
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

  return { products, ready, reload };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    setCategories(categoryService.getAll());
    setReady(true);

    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const live = await res.json();
        setCategories(live);
        writeStorage(STORAGE_KEYS.CATEGORIES, live);
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
    setMedia(mediaService.getAll());
    setReady(true);

    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const live = await res.json();
        setMedia(live);
        writeStorage(STORAGE_KEYS.MEDIA, live);
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
    setEnquiries(enquiryService.getAll());
    setReady(true);

    try {
      const res = await fetch("/api/enquiries");
      if (res.ok) {
        const live = await res.json();
        setEnquiries(live);
        writeStorage(STORAGE_KEYS.ENQUIRIES, live);
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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) {
        const live = await res.json();
        setBanners(live);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { banners, ready, reload };
}
