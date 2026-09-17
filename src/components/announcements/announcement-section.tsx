"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementForm } from "@/components/announcements/announcement-form";
import { AnnouncementList } from "@/components/announcements/announcement-list";
import { AnnouncementsApiError, getAnnouncements } from "@/lib/api/announcements";
import type { Announcement } from "@/types/announcements";

export function AnnouncementSection() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();

        if (!isActive) {
          return;
        }

        setAnnouncements(data);
        setLoadError(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof AnnouncementsApiError && error.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        setLoadError(
          error instanceof AnnouncementsApiError
            ? error.message
            : "Failed to load announcements.",
        );
        setAnnouncements([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAnnouncements();

    return () => {
      isActive = false;
    };
  }, [router]);

  function handleCreated(announcement: Announcement) {
    setAnnouncements((current) => [announcement, ...current]);
    setLoadError(null);
  }

  return (
    <section className="flex flex-col gap-8" aria-labelledby="announcements-heading">
      <div>
        <h2 id="announcements-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Announcements
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Stay updated with team announcements.
        </p>
      </div>

      <AnnouncementForm onCreated={handleCreated} />

      <div>
        <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent announcements</h3>
        <AnnouncementList announcements={announcements} isLoading={isLoading} loadError={loadError} />
      </div>
    </section>
  );
}
