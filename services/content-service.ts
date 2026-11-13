import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { WebsiteContent } from "@/types";
import { readStorage, STORAGE_KEYS, writeStorage } from "./storage";

/**
 * Website Content & Settings Service (Frontend Demo Implementation)
 */
export const contentService = {
  get(): WebsiteContent {
    return readStorage<WebsiteContent>(STORAGE_KEYS.CONTENT, DEFAULT_WEBSITE_CONTENT);
  },

  update(next: WebsiteContent): WebsiteContent {
    writeStorage(STORAGE_KEYS.CONTENT, next);
    return next;
  },

  reset(): WebsiteContent {
    writeStorage(STORAGE_KEYS.CONTENT, DEFAULT_WEBSITE_CONTENT);
    return DEFAULT_WEBSITE_CONTENT;
  },

  buildWhatsAppUrl(whatsappNumber: string, message: string): string {
    const digitsOnly = whatsappNumber.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${digitsOnly}?text=${encoded}`;
  },
};

