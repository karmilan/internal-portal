import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  createAnnouncementSchema,
  validationDetailsFromZodError,
} from "@/lib/announcements.validation";
import { createAnnouncement, getAnnouncements } from "@/services/announcement.service";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const announcements = await getAnnouncements();
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Failed to fetch announcements", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: { body: "Invalid request body" },
      },
      { status: 400 },
    );
  }

  const parsed = createAnnouncementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validationDetailsFromZodError(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const announcement = await createAnnouncement(auth.id, parsed.data);
    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Failed to create announcement", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
