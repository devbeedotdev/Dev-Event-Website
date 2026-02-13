import { Event, EventInput, EventMode } from "@/types/event.types";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "events.json");

async function writeEvents(events: Array<Event>): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(events, null, 2));
}

export async function readEvents(): Promise<Event[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data) as Event[];
  } catch (error) {
    // If file does not exist, initialize it
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeEvents([]);
      return [];
    }

    throw error;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // replace spaces with dash
}

function ensureUniqueSlug(baseSlug: string, events: Event[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (events.some((event) => event.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

function validateEventInput(input: EventInput): void {
  const requiredStringFields: (keyof EventInput)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStringFields) {
    const value = input[field];

    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${field} is required and must be a non-empty string`);
    }
  }

  const allowedModes: EventMode[] = ["online", "offline", "hybrid"];
  if (!allowedModes.includes(input.mode)) {
    throw new Error(`Invalid mode. Must be one of: ${allowedModes.join(", ")}`);
  }

  if (!Array.isArray(input.agenda) || input.agenda.length === 0) {
    throw new Error("agenda must be a non-empty array of strings");
  }

  if (!Array.isArray(input.tags) || input.tags.length === 0) {
    throw new Error("tags must be a non-empty array of strings");
  }
}

function normalizeDate(date: string): string {
  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    throw new Error("Invalid date format");
  }

  return parsed.toISOString();
}

function normalizeTime(time: string): string {
  const trimmed = time.trim();

  // Basic HH:MM validation (24hr)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(trimmed)) {
    throw new Error("Time must be in HH:MM 24-hour format");
  }

  return trimmed;
}

export async function createEvent(input: EventInput): Promise<Event> {
  // 1️⃣ Validate required fields
  validateEventInput(input);

  // 2️⃣ Read existing events
  const events = await readEvents();

  // 3️⃣ Generate base slug
  const baseSlug = generateSlug(input.title);

  // 4️⃣ Ensure slug uniqueness
  const uniqueSlug = ensureUniqueSlug(baseSlug, events);

  // 5️⃣ Normalize date & time
  const normalizedDate = normalizeDate(input.date);
  const normalizedTime = normalizeTime(input.time);

  // 6️⃣ Generate timestamps
  const now = new Date().toISOString();

  const newEvent: Event = {
    id: crypto.randomUUID(),
    ...input,
    slug: uniqueSlug,
    date: normalizedDate,
    time: normalizedTime,
    createdAt: now,
    updatedAt: now,
  };

  // 7️⃣ Persist to file
  events.push(newEvent);
  await writeEvents(events);

  return newEvent;
}

export async function getAllEvents(): Promise<Event[]> {
  const events = await readEvents();

  // Optional: sort newest first (production-style behavior)
  return events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const events = await readEvents();

  const event = events.find((e) => e.slug === slug);

  return event ?? null;
}

export async function updateEvent(
  slug: string,
  updates: Partial<EventInput>,
): Promise<Event | null> {
  const events = await readEvents();

  const index = events.findIndex((e) => e.slug === slug);

  if (index === -1) {
    return null;
  }

  const existingEvent = events[index];

  // Merge updates into existing event (without overwriting protected fields)
  const merged: EventInput = {
    title: updates.title ?? existingEvent.title,
    description: updates.description ?? existingEvent.description,
    overview: updates.overview ?? existingEvent.overview,
    image: updates.image ?? existingEvent.image,
    venue: updates.venue ?? existingEvent.venue,
    location: updates.location ?? existingEvent.location,
    date: updates.date ?? existingEvent.date,
    time: updates.time ?? existingEvent.time,
    mode: updates.mode ?? existingEvent.mode,
    audience: updates.audience ?? existingEvent.audience,
    agenda: updates.agenda ?? existingEvent.agenda,
    organizer: updates.organizer ?? existingEvent.organizer,
    tags: updates.tags ?? existingEvent.tags,
  };

  // Validate merged data
  validateEventInput(merged);

  let newSlug = existingEvent.slug;

  // Regenerate slug only if title changed
  if (updates.title && updates.title !== existingEvent.title) {
    const baseSlug = generateSlug(updates.title);
    newSlug = ensureUniqueSlug(
      baseSlug,
      events.filter((e) => e.id !== existingEvent.id),
    );
  }

  const normalizedDate = normalizeDate(merged.date);
  const normalizedTime = normalizeTime(merged.time);

  const updatedEvent: Event = {
    ...existingEvent,
    ...merged,
    slug: newSlug,
    date: normalizedDate,
    time: normalizedTime,
    updatedAt: new Date().toISOString(),
  };

  events[index] = updatedEvent;

  await writeEvents(events);

  return updatedEvent;
}

export async function deleteEvent(slug: string): Promise<boolean> {
  const events = await readEvents();

  const index = events.findIndex((e) => e.slug === slug);

  if (index === -1) {
    return false;
  } else {
    events.splice(index, 1);
    await writeEvents(events);
    return true;
  }
}
