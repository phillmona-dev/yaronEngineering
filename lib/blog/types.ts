/** Types mirroring API_DOCUMENTATION.md. Keep in sync with the Spring Boot DTOs. */

export type Role = "ADMIN" | "EDITOR" | "AUTHOR";
export type ArticleStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

export type Media = {
  id: string;
  url: string;
  altText: string;
  width: number | null;
  height: number | null;
  mimeType: string;
  sizeBytes?: number;
  originalFilename?: string;
  createdAt?: string;
};

export type CategoryRef = { id: string; name: string; slug: string };
export type TagRef = { id: string; name: string; slug: string };

export type Category = CategoryRef & {
  description?: string | null;
  tagline?: string | null;
  articleCount?: number;
  sortOrder?: number;
  related?: Category[];
};

export type Tag = TagRef & { articleCount?: number };

export type Author = {
  id: string;
  name: string;
  slug: string;
  position?: string | null;
  bio?: string | null;
  avatar?: Media | null;
  linkedinUrl?: string | null;
  articleCount?: number;
  userId?: string | null;
};

export type AuthorRef = Pick<Author, "id" | "name" | "slug" | "position" | "avatar">;

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: Media | null;
  category: CategoryRef | null;
  tags: TagRef[];
  author: AuthorRef | null;
  status: ArticleStatus;
  featured: boolean;
  readingTimeMinutes: number;
  viewCount: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  highlight?: string;
};

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type ArticleSeo = {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  ogImage: Media | null;
  noIndex: boolean;
};

export type ArticleDetail = ArticleSummary & {
  contentHtml: string;
  contentJson: unknown | null;
  toc: TocItem[];
  seo: ArticleSeo;
  related: ArticleSummary[];
};

export type ArticleRequest = {
  title: string;
  slug?: string | null;
  excerpt: string;
  contentHtml: string;
  contentJson: unknown | null;
  coverImageId: string | null;
  categoryId: string | null;
  tagIds: string[];
  authorId: string | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageId: string | null;
  noIndex: boolean;
};

export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiError = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  errors?: { field: string; message: string }[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  authorSlug?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
};

export type SecurityOverview = {
  user: User;
  passwordChangedAt: string | null;
  sessionTtlSeconds: number;
  passwordMinLength: number;
  passwordPolicy: string;
  resetEmailEnabled: boolean;
};

export type Revision = {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
};

export type DashboardStats = {
  totalArticles: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  totalViews: number;
  viewsLast30Days: { date: string; views: number }[];
  mostRead: ArticleSummary[];
  recent: ArticleSummary[];
  recentActivity: {
    at: string;
    actor: string;
    action: string;
    articleTitle: string;
    articleId: string;
  }[];
  unreadMessages: number;
  recentMessages: ContactMessage[];
};

export type Settings = {
  siteTitle: string;
  blogTitle: string;
  blogTagline: string;
  newsletterHeading: string;
  newsletterText: string;
  defaultOgImage: Media | null;
};

export type SitemapData = {
  articles: { slug: string; updatedAt: string }[];
  categories: { slug: string }[];
  tags: { slug: string }[];
  authors: { slug: string }[];
};

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
  repliedAt: string | null;
};

export type ContactSummary = {
  unread: number;
  total: number;
  last24h: number;
  replied: number;
  archived: number;
};

/** One customised website section as stored by the backend (`/api/v1/site-content`). */
export type SiteContentDoc = {
  section: string;
  data: Record<string, unknown>;
  updatedAt: string;
  updatedBy?: string | null;
};
