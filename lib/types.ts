export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: "personal" | "startup";
  tags: string[];
  featured: boolean;
  coverImage?: string;
  readingTime: number;
  views: number;
  publishedUrl?: string;
  isPublished: boolean;
}

export interface BlogMetadata {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface NotionPageProperty {
  id: string;
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  date?: { start: string };
  checkbox?: boolean;
  number?: number;
  url?: string;
  email?: string;
  people?: Array<{ name: string }>;
  status?: { name: string };
}

export interface NotionPage {
  id: string;
  properties: {
    [key: string]: NotionPageProperty;
  };
  cover?: {
    type: string;
    file?: {
      url: string;
    };
    external?: {
      url: string;
    };
  };
  created_time: string;
  last_edited_time: string;
}
