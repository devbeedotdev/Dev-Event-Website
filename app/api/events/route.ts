import {
  createEvent,
  getAllEvents,
  validateEventInput,
} from "@/lib/events.service";
import { EventInput } from "@/types/event.types";
import { v2 as cloudinary } from "cloudinary";
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
    const formData = await request.formData();

    // 1. Convert the entire form to a plain object in one line
    const rawData = Object.fromEntries(formData.entries());

    // 2. Handle the arrays (since FormData treats everything as a string)
    const body: EventInput = {
      ...rawData,
      agenda:
        typeof rawData.agenda === "string" ? JSON.parse(rawData.agenda) : [],
      tags: typeof rawData.tags === "string" ? JSON.parse(rawData.tags) : [],
    } as EventInput;
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
    body.image = (uploadResult as { secure_url: string }).secure_url;

    validateEventInput(body);

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
