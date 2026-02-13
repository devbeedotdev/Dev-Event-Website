export type EventMode = "online" | "offline" | "hybrid";

/**
 * Data coming from client when creating an event
 */
export interface EventInput {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

/**
 * Event stored in our JSON "database"
 */
export interface Event extends EventInput {
  id: string;
  slug: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
