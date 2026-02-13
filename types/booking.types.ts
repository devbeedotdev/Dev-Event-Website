/**
 * Data coming from client when creating a booking
 */
export interface BookingInput {
  eventId: string;
  email: string;
}

/**
 * Booking stored in our JSON database
 */
export interface Booking extends BookingInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
