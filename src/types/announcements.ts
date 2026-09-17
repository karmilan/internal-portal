export type AnnouncementAuthor = {
  id: string;
  name: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: AnnouncementAuthor;
};

export type CreateAnnouncementInput = {
  title: string;
  content: string;
};

export type AnnouncementsListResponse = {
  announcements: Announcement[];
};

export type AnnouncementCreateResponse = {
  announcement: Announcement;
};

export type ValidationErrorResponse = {
  error: string;
  details?: Record<string, string>;
};
