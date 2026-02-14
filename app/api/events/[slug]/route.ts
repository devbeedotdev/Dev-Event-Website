import { NextResponse } from "next/server";

import { deleteEvent, getEventBySlug, updateEvent } from "@/lib/events.service";
import { EventInput } from "@/types/event.types";
import { v2 as cloudinary } from "cloudinary";

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
    const formData = await request.formData();

    // 1. Convert FormData to a plain object
    const rawData = Object.fromEntries(formData.entries());

    // 2. Prepare the updates object
    // We only include fields that actually exist in the form submission
    const updates: Partial<EventInput> = { ...rawData };

    // 3. Handle special types (Arrays & Numbers)
    // Since FormData sends everything as strings, we must parse the arrays back
    if (formData.has("agenda")) {
      updates.agenda = JSON.parse(formData.get("agenda") as string);
    }
    if (formData.has("tags")) {
      updates.tags = JSON.parse(formData.get("tags") as string);
    }
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          },
        )
        .end(buffer);
    });
    updates.image = (uploadResult as { secure_url: string }).secure_url;

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
