import { formatAnnouncementDate } from "@/lib/format-announcement-date";
import type { Announcement } from "@/types/announcements";

type AnnouncementCardProps = {
  announcement: Announcement;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{announcement.title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{announcement.content}</p>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {announcement.author.name} · {formatAnnouncementDate(announcement.createdAt)}
      </p>
    </article>
  );
}
