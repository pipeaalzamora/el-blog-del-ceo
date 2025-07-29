import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost, NotionPage, NotionPageProperty } from "./types";
import { blogCache } from "./cache";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Función para obtener el valor de una propiedad de Notion
function getPropertyValue(
  property: NotionPageProperty | null | undefined
): string | string[] | number | boolean {
  // Si la propiedad no existe o es null/undefined, retornar valor por defecto
  if (!property || !property.type) {
    return "";
  }

  switch (property.type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
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
    case "people":
      return (
        property.people?.map((person) => person.name || "Usuario").join(", ") ||
        ""
      );
    case "status":
      return property.status?.name || "";
    default:
      return "";
  }
}

// Función para convertir página de Notion a BlogPost
function notionPageToBlogPost(page: NotionPage, content: string): BlogPost {
  const properties = page.properties;

  try {
    // Campos obligatorios según la estructura definida
    const titulo = String(getPropertyValue(properties.Titulo) || "Sin título");
    const estado = String(getPropertyValue(properties.Estado) || "Borrador");
    const categoria = String(
      getPropertyValue(properties.Categoria) || "Personal"
    );
    const fecha = String(
      getPropertyValue(properties.Fecha) || page.created_time
    );
    const autor = String(getPropertyValue(properties.Autor) || "CEO");

    // Campos opcionales según la estructura definida
    const resumen = String(getPropertyValue(properties.Resumen) || "");
    const tagsValue = getPropertyValue(properties.Tags);
    const tags = Array.isArray(tagsValue) ? tagsValue : [];
    const destacado = Boolean(getPropertyValue(properties.Destacado) || false);
    const vistas = Number(getPropertyValue(properties.Vistas) || 0);
    const urlOriginal = String(getPropertyValue(properties.URL_Original) || "");

    // Generar slug del título
    const slug = titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remover acentos
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Generar excerpt
    const excerpt =
      resumen ||
      (content
        ? content
            .split("\n")
            .find((line) => line.trim().length > 0)
            ?.substring(0, 150) + "..."
        : "");

    // Determinar si está publicado
    const isPublished = estado === "Publicado";

    // Determinar si es destacado (checkbox o muchas vistas)
    const featured = destacado || vistas > 100;

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

    // Mapear categoría a los valores esperados por la aplicación
    let mappedCategory: "personal" | "startup" = "personal";
    if (categoria === "Emprendimiento") {
      mappedCategory = "startup";
    } else if (categoria === "Personal") {
      mappedCategory = "personal";
    }

    return {
      id: page.id,
      title: titulo,
      slug,
      excerpt,
      content,
      publishedAt: fecha,
      updatedAt: page.last_edited_time,
      author: autor,
      category: mappedCategory,
      tags: Array.isArray(tags) ? tags : [],
      featured,
      coverImage,
      readingTime,
      views: vistas,
      publishedUrl: urlOriginal,
      isPublished,
    };
  } catch (error) {
    console.error(
      `Error procesando propiedades de la página ${page.id}:`,
      error
    );
    // Retornar un objeto básico para evitar que falle completamente
    return {
      id: page.id,
      title: "Post sin título",
      slug: `post-${page.id}`,
      excerpt: "Contenido no disponible",
      content: content || "",
      publishedAt: page.created_time,
      updatedAt: page.last_edited_time,
      author: "CEO",
      category: "personal",
      tags: [],
      featured: false,
      coverImage: "",
      readingTime: 1,
      views: 0,
      publishedUrl: "",
      isPublished: false,
    };
  }
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

    // Filtro base: solo posts publicados
    const publishedFilter = {
      property: "Estado",
      select: {
        equals: "Publicado",
      },
    };

    // Construir filtro final
    let finalFilter;
    if (category) {
      const categoryName =
        category === "startup" ? "Emprendimiento" : "Personal";
      finalFilter = {
        and: [
          publishedFilter,
          {
            property: "Categoria",
            select: {
              equals: categoryName,
            },
          },
        ],
      };
    } else {
      finalFilter = publishedFilter;
    }

    // Construir la consulta
    const queryOptions = {
      database_id: databaseId,
      filter: finalFilter,
      sorts: [
        {
          property: "Fecha",
          direction: "descending" as const,
        },
      ],
    };

    const response = await notion.databases.query(queryOptions);

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

        // Solo incluir posts que están realmente publicados
        if (post.isPublished) {
          posts.push(post);
        }
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

// Función pública con cache mejorado
export async function getBlogPosts(category?: "personal" | "startup"): Promise<BlogPost[]> {
  return blogCache.getAllPosts(category);
}

// Actualizar la implementación del cache
blogCache.getAllPosts = async (category?: string) => {
  return _getBlogPosts(category as "personal" | "startup" | undefined);
};

// Obtener un post específico por slug con cache
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return blogCache.getPost(slug);
}

// Actualizar la implementación del cache
blogCache.getPost = async (slug: string) => {
  try {
    const posts = await _getBlogPosts();
    return posts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error("Error obteniendo post:", error);
    return null;
  }
};

// Obtener posts destacados con cache
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  return blogCache.getFeaturedPosts();
}

// Actualizar la implementación del cache
blogCache.getFeaturedPosts = async () => {
  try {
    const posts = await _getBlogPosts();
    return posts.filter((post: BlogPost) => post.featured).slice(0, 3);
  } catch (error) {
    console.error("Error obteniendo posts destacados:", error);
    return [];
  }
};

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

// Buscar posts por query
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    if (!query.trim()) {
      return await getBlogPosts();
    }

    const posts = await getBlogPosts();
    const searchTerm = query.toLowerCase().trim();

    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
      const contentMatch = post.content.toLowerCase().includes(searchTerm);
      const tagsMatch = post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm)
      );
      const authorMatch = post.author.toLowerCase().includes(searchTerm);

      return (
        titleMatch || excerptMatch || contentMatch || tagsMatch || authorMatch
      );
    });
  } catch (error) {
    console.error("Error buscando posts:", error);
    return [];
  }
}

// Obtener un post específico por ID
export async function getBlogPostById(
  pageId: string
): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    return posts.find((post: BlogPost) => post.id === pageId) || null;
  } catch (error) {
    console.error("Error obteniendo post por ID:", error);
    return null;
  }
}
