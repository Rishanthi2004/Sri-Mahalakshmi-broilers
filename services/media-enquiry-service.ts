import { DEFAULT_ENQUIRIES, DEFAULT_MEDIA } from "@/data/enquiries";
import { Enquiry, EnquiryStatus, MediaItem } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

export const mediaService = {
  getAll(): MediaItem[] {
    return readStorage<MediaItem[]>(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  },

  add(input: Omit<MediaItem, "id" | "uploadedAt">): MediaItem {
    const current = this.getAll();
    const item: MediaItem = {
      ...input,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.MEDIA, [item, ...current]);
    return item;
  },

  replace(id: string, patch: Partial<Omit<MediaItem, "id">>): MediaItem | null {
    const current = this.getAll();
    const idx = current.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const updated: MediaItem = {
      ...current[idx],
      ...patch,
      uploadedAt: new Date().toISOString(),
    };
    const next = [...current];
    next[idx] = updated;
    writeStorage(STORAGE_KEYS.MEDIA, next);
    return updated;
  },

  remove(id: string): void {
    const next = this.getAll().filter((m) => m.id !== id);
    writeStorage(STORAGE_KEYS.MEDIA, next);
  },
};

export const enquiryService = {
  getAll(): Enquiry[] {
    return readStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
  },

  submit(input: Omit<Enquiry, "id" | "submittedAt" | "status">): Enquiry {
    const current = this.getAll();
    const created: Enquiry = {
      ...input,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "new",
    };
    writeStorage(STORAGE_KEYS.ENQUIRIES, [created, ...current]);
    return created;
  },

  updateStatus(id: string, status: EnquiryStatus): void {
    const current = this.getAll().map((e) => (e.id === id ? { ...e, status } : e));
    writeStorage(STORAGE_KEYS.ENQUIRIES, current);
  },

  remove(id: string): void {
    const next = this.getAll().filter((e) => e.id !== id);
    writeStorage(STORAGE_KEYS.ENQUIRIES, next);
  },
};

