import { prisma } from "@/lib/prisma";

const announcementSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export type AnnouncementWithAuthor = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
};

export async function getAnnouncements(): Promise<AnnouncementWithAuthor[]> {
  return prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    select: announcementSelect,
  });
}

export async function createAnnouncement(
  authorId: string,
  input: { title: string; content: string },
): Promise<AnnouncementWithAuthor> {
  return prisma.announcement.create({
    data: {
      title: input.title,
      content: input.content,
      authorId,
    },
    select: announcementSelect,
  });
}
