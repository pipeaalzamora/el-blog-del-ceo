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
  [key: string]: any;
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
