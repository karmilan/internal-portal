"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusMessage } from "@/components/ui/status-message";
import { AnnouncementsApiError, createAnnouncement } from "@/lib/api/announcements";
import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
  createAnnouncementSchema,
  validationDetailsFromZodError,
} from "@/lib/announcements.validation";
import type { Announcement } from "@/types/announcements";

type AnnouncementFormProps = {
  onCreated: (announcement: Announcement) => void;
};

type FieldErrors = {
  title?: string;
  content?: string;
};

export function AnnouncementForm({ onCreated }: AnnouncementFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const parsed = createAnnouncementSchema.safeParse({ title, content });

    if (!parsed.success) {
      setFieldErrors(validationDetailsFromZodError(parsed.error));
      return;
    }

    setIsSubmitting(true);

    try {
      const announcement = await createAnnouncement(parsed.data);
      onCreated(announcement);
      setTitle("");
      setContent("");
      setFieldErrors({});
      setSuccessMessage("Announcement posted successfully.");
    } catch (error) {
      if (error instanceof AnnouncementsApiError) {
        if (error.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (error.status === 400 && error.details) {
          setFieldErrors(error.details);
          return;
        }

        if (error.status >= 500 || error.status === 0) {
          setFormError("Something went wrong. Please try again.");
          return;
        }

        setFormError(error.message);
        return;
      }

      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const titleLength = title.length;
  const contentLength = content.length;
  const fieldClassName =
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create announcement</h3>

      <div className="mt-5 flex flex-col gap-1.5">
        <label htmlFor="announcement-title" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Title
        </label>
        <input
          id="announcement-title"
          name="title"
          type="text"
          value={title}
          disabled={isSubmitting}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={ANNOUNCEMENT_TITLE_MAX_LENGTH}
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "announcement-title-error" : "announcement-title-count"}
          className={fieldClassName}
        />
        <div className="flex items-start justify-between gap-3">
          {fieldErrors.title ? (
            <p id="announcement-title-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {fieldErrors.title}
            </p>
          ) : (
            <span />
          )}
          <p id="announcement-title-count" className="text-xs text-zinc-500 dark:text-zinc-400">
            {titleLength} / {ANNOUNCEMENT_TITLE_MAX_LENGTH}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="announcement-content" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Content
        </label>
        <textarea
          id="announcement-content"
          name="content"
          rows={5}
          value={content}
          disabled={isSubmitting}
          onChange={(event) => setContent(event.target.value)}
          maxLength={ANNOUNCEMENT_CONTENT_MAX_LENGTH}
          aria-invalid={Boolean(fieldErrors.content)}
          aria-describedby={
            fieldErrors.content ? "announcement-content-error" : "announcement-content-count"
          }
          className={`resize-y ${fieldClassName}`}
        />
        <div className="flex items-start justify-between gap-3">
          {fieldErrors.content ? (
            <p id="announcement-content-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {fieldErrors.content}
            </p>
          ) : (
            <span />
          )}
          <p id="announcement-content-count" className="text-xs text-zinc-500 dark:text-zinc-400">
            {contentLength} / {ANNOUNCEMENT_CONTENT_MAX_LENGTH}
          </p>
        </div>
      </div>

      {formError ? (
        <div className="mt-4">
          <StatusMessage variant="error">{formError}</StatusMessage>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4">
          <StatusMessage variant="success">{successMessage}</StatusMessage>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="min-h-11 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {isSubmitting ? "Posting…" : "Post announcement"}
        </button>
      </div>
    </form>
  );
}
