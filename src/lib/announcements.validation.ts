import { z } from "zod";

export const ANNOUNCEMENT_TITLE_MAX_LENGTH = 150;
export const ANNOUNCEMENT_CONTENT_MAX_LENGTH = 5000;

export const createAnnouncementSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(ANNOUNCEMENT_TITLE_MAX_LENGTH, "Title must be 150 characters or less."),
  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(1, "Content is required")
    .max(ANNOUNCEMENT_CONTENT_MAX_LENGTH, "Content must be 5000 characters or less."),
});

export function validationDetailsFromZodError(error: z.ZodError): Record<string, string> {
  const details: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string" || field in details) {
      continue;
    }

    details[field] = issue.message;
  }

  return details;
}
