import type {
  Announcement,
  AnnouncementCreateResponse,
  AnnouncementsListResponse,
  CreateAnnouncementInput,
  ValidationErrorResponse,
} from "@/types/announcements";

export class AnnouncementsApiError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "AnnouncementsApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new AnnouncementsApiError(response.status, "Something went wrong. Please try again.");
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetch("/api/announcements");

  if (response.status === 401) {
    throw new AnnouncementsApiError(401, "You are not authorized.");
  }

  if (!response.ok) {
    const body = await parseJson<{ error?: string }>(response);
    throw new AnnouncementsApiError(
      response.status,
      body.error ?? "Failed to load announcements.",
    );
  }

  const data = await parseJson<AnnouncementsListResponse>(response);
  return data.announcements;
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  const response = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 401) {
    throw new AnnouncementsApiError(401, "You are not authorized.");
  }

  if (response.status === 400) {
    const body = await parseJson<ValidationErrorResponse>(response);
    throw new AnnouncementsApiError(
      400,
      body.error ?? "Validation failed",
      body.details,
    );
  }

  if (!response.ok) {
    const body = await parseJson<{ error?: string }>(response);
    throw new AnnouncementsApiError(
      response.status,
      body.error ?? "Failed to create announcement.",
    );
  }

  const data = await parseJson<AnnouncementCreateResponse>(response);
  return data.announcement;
}
