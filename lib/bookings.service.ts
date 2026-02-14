import { Event } from "@/types/event.types";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Booking, BookingInput } from "../types/booking.types";
import { readEvents } from "./events.service";

const BOOKING_FILE = path.join(process.cwd(), "data", "bookings.json");

/**
 * Helper to read all bookings from JSON file
 */
function readBookings(): Booking[] {
  try {
    const data = fs.readFileSync(BOOKING_FILE, "utf-8");
    return JSON.parse(data) as Booking[];
  } catch (err) {
    return [];
  }
}

/**
 * Helper to write all bookings to JSON file
 */
function writeBookings(bookings: Booking[]) {
  fs.writeFileSync(BOOKING_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

/**
 * Create a new booking
 * - Validate email format
 * - Ensure eventId exists
 * - Prevent duplicate booking for same event/email
 */
export async function createBooking(input: BookingInput): Promise<Booking> {
  const bookings = readBookings(); // If this is sync, keep it
  const events = await readEvents(); // await because it's a Promise

  // Validate email
  if (!/\S+@\S+\.\S+/.test(input.email)) {
    throw new Error("Invalid email format");
  }

  // Validate event exists
  const eventExists = events.some((e: Event) => e.id === input.eventId);
  if (!eventExists) {
    throw new Error(`Event with id ${input.eventId} does not exist`);
  }

  // Prevent duplicate booking for same event/email
  const duplicate = bookings.find(
    (b) => b.eventId === input.eventId && b.email === input.email,
  );
  if (duplicate) {
    throw new Error("You have already booked this event");
  }

  const newBooking: Booking = {
    ...input,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  return newBooking;
}

/**
 * Read all bookings
 */
export function getBookings(): Booking[] {
  return readBookings();
}
