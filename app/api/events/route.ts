import { createEvent, getAllEvents } from "@/lib/events.service";
import { EventInput } from "@/types/event.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allEvent = await getAllEvents();
    return NextResponse.json(
      {
        message: "Events fetched successfully",
        data: allEvent,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: EventInput = await request.json();

    const created = await createEvent(body);

    return NextResponse.json(
      { message: "Event created successfully", data: created },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 },
    );
  }
}
