import { NextResponse } from "next/server";

import { deleteEvent, getEventBySlug, updateEvent } from "@/lib/events.service";
import { EventInput } from "@/types/event.types";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json(
      { message: `Failed to fetch event ${(e as Error).message}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const updates: Partial<EventInput> = await request.json();

    const updated = await updateEvent(slug, updates);

    if (!updated) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const deleted = await deleteEvent(slug);

    if (!deleted) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 },
    );
  }
}
