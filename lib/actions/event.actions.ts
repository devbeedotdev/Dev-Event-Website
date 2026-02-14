"use server";

import { Event } from "@/types/event.types";
import { readEvents } from "../events.service";

export async function getSimilarEvent(slug: string): Promise<Event[]> {
  try {
    const events = await readEvents();
    const currentItem = events.find((item) => item.slug === slug);

    if (!currentItem) {
      return [];
    }

    const currentTags = new Set(currentItem.tags);

    return events.filter((item) => {
      if (item.slug === slug) return false;

      return item.tags.some((tag) => currentTags.has(tag));
    });
  } catch {
    return [];
  }
}
