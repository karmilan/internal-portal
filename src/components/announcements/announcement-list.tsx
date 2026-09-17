import { AnnouncementCard } from "@/components/announcements/announcement-card";
import type { Announcement } from "@/types/announcements";

type AnnouncementListProps = {
  announcements: Announcement[];
  isLoading: boolean;
  loadError: string | null;
};

export function AnnouncementList({ announcements, isLoading, loadError }: AnnouncementListProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading announcements…
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200" role="alert">
        {loadError}
      </p>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">No announcements yet.</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Be the first to post an announcement.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <AnnouncementCard announcement={announcement} />
        </li>
      ))}
    </ul>
  );
}
