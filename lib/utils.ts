/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleApiError(error: any) {
  console.error("API Error:", error); // Log it so you can see it in your terminal

  // 1. Check for File System errors (Server's fault)
  if (error.code === "ENOENT") {
    return NextResponse.json(
      { error: "Database file not found" },
      { status: 500 },
    );
  }

  // 2. Check for JSON syntax errors (User's fault - sent bad JSON)
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid JSON format in request body" },
      { status: 400 },
    );
  }

  // 3. Check for specific Validation errors (Custom logic)
  if (error.message?.includes("required")) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 4. Default: The "I don't know what happened" error
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
