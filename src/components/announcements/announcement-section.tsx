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
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function runLoad() {
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

        setAnnouncements([]);
        setLoadError(
          error instanceof AnnouncementsApiError
            ? error.message
            : "Unable to load announcements. Please try again.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void runLoad();

    return () => {
      isActive = false;
    };
  }, [router, reloadToken]);

  function handleRetry() {
    setIsLoading(true);
    setLoadError(null);
    setAnnouncements([]);
    setReloadToken((current) => current + 1);
  }

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
        <AnnouncementList
          announcements={announcements}
          isLoading={isLoading}
          loadError={loadError}
          onRetry={handleRetry}
          isRetrying={isLoading && reloadToken > 0}
        />
      </div>
    </section>
  );
}
