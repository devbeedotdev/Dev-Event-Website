import { createBooking, getBookings } from "@/lib/bookings.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const bookings = getBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch bookings",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBooking = createBooking(body);
    return NextResponse.json(
      { message: "Booking created successfully", booking: newBooking },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Booking creation failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 400 },
    );
  }
}
