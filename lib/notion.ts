import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost, NotionPage } from "./types";
import { unstable_cache } from "next/cache";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Función para obtener el valor de una propiedad de Notion
function getPropertyValue(property: any): any {
  switch (property.type) {
    case "title":
      return property.title[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text[0]?.plain_text || "";
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select.map((item: any) => item.name) || [];
    case "date":
      return property.date?.start || "";
    case "checkbox":
      return property.checkbox || false;
    case "number":
      return property.number || 0;
    case "url":
      return property.url || "";
    case "email":
      return property.email || "";
    default:
      return "";
  }
}

// Función para convertir página de Notion a BlogPost
function notionPageToBlogPost(page: NotionPage, content: string): BlogPost {
  const properties = page.properties;

  const title = getPropertyValue(
    properties.Título || properties.Title || properties.title
  );
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();

  const excerpt = getPropertyValue(
    properties.Resumen || properties.Excerpt || properties.excerpt
  );
  const category = getPropertyValue(
    properties.Categoría || properties.Category || properties.category
  );
  const tags = getPropertyValue(properties.Tags || properties.tags);
  const featured = getPropertyValue(
    properties.Destacado || properties.Featured || properties.featured
  );
  const author =
    getPropertyValue(
      properties.Autor || properties.Author || properties.author
    ) || "CEO";

  // Calcular tiempo de lectura estimado (250 palabras por minuto)
  const safeContent = content || "";
  const wordCount = safeContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 250));

  // Obtener imagen de portada
  let coverImage = "";
  if (page.cover) {
    coverImage =
      page.cover.type === "file"
        ? page.cover.file?.url || ""
        : page.cover.external?.url || "";
  }

  return {
    id: page.id,
    title,
    slug,
    excerpt,
    content,
    publishedAt: page.created_time,
    updatedAt: page.last_edited_time,
    author,
    category: category === "Startup" ? "startup" : "personal",
    tags,
    featured,
    coverImage,
    readingTime,
  };
}

// Función interna para obtener posts (sin cache)
async function _getBlogPosts(
  category?: "personal" | "startup"
): Promise<BlogPost[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID no está configurado");
    }

    // Construir filtro base
    const publishedFilter = {
      property: "Publicado",
      checkbox: {
        equals: true,
      },
    };

    // Construir filtro final
    let finalFilter;
    if (category) {
      const categoryName = category === "startup" ? "Startup" : "Personal";
      finalFilter = {
        and: [
          publishedFilter,
          {
            property: "Categoría",
            select: {
              equals: categoryName,
            },
          },
        ],
      };
    } else {
      finalFilter = publishedFilter;
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: finalFilter,
      sorts: [
        {
          property: "Fecha",
          direction: "descending",
        },
      ],
    });

    const posts: BlogPost[] = [];

    for (const page of response.results) {
      try {
        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdStringObject = n2m.toMarkdownString(mdblocks);
        const content =
          typeof mdStringObject === "string"
            ? mdStringObject
            : mdStringObject.parent || "";
        const post = notionPageToBlogPost(page as NotionPage, content);
        posts.push(post);
      } catch (error) {
        console.error(`Error procesando página ${page.id}:`, error);
      }
    }

    return posts;
  } catch (error) {
    console.error("Error obteniendo posts:", error);
    return [];
  }
}

// Función pública con cache
export const getBlogPosts = unstable_cache(_getBlogPosts, ["blog-posts"], {
  tags: ["blog-posts"],
  revalidate: 3600, // Revalidar cada hora como fallback
});

// Obtener un post específico por slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    return posts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error("Error obteniendo post:", error);
    return null;
  }
}

// Obtener posts destacados
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts.filter((post: BlogPost) => post.featured).slice(0, 3);
  } catch (error) {
    console.error("Error obteniendo posts destacados:", error);
    return [];
  }
}

// Obtener posts recientes
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Error obteniendo posts recientes:", error);
    return [];
  }
}
