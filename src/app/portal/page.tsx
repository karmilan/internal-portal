import { redirect } from "next/navigation";
import { AnnouncementSection } from "@/components/announcements/announcement-section";
import { LogoutButton } from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function PortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Internal Portal</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome, {user.name}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <main>
        <AnnouncementSection />
      </main>
    </div>
  );
}
