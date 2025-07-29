import { cache } from "react";
import { BlogPost } from "./types";

// Cache en memoria simple para desarrollo
// En producción, usar Redis o similar
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar si expiró
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global del cache
const memoryCache = new MemoryCache();

// Limpiar cache cada 5 minutos
if (typeof window === "undefined") {
  setInterval(
    () => {
      memoryCache.cleanup();
    },
    5 * 60 * 1000
  );
}

/**
 * Cache wrapper con React cache para deduplicación
 */
export function createCachedFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlSeconds: number = 300
) {
  // React cache para deduplicación en el mismo render
  const reactCached = cache(fn);

  return async (...args: T): Promise<R> => {
    const cacheKey = keyGenerator(...args);

    // Intentar obtener del cache en memoria
    const cached = memoryCache.get<R>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Si no está en cache, ejecutar función
    const result = await reactCached(...args);

    // Guardar en cache
    memoryCache.set(cacheKey, result, ttlSeconds);

    return result;
  };
}

/**
 * Invalidar cache por patrón de clave
 */
export function invalidateCache(pattern: string): void {
  const keys = Array.from(memoryCache["cache"].keys());
  keys.forEach((key) => {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  });
}

/**
 * Cache específico para posts del blog
 */
export const blogCache = {
  // Cache para todos los posts
  getAllPosts: createCachedFunction(
    async (_category?: string) => {
      // Esta función será implementada en notion.ts
      return [] as BlogPost[];
    },
    (category) => `blog-posts-${category || "all"}`,
    300 // 5 minutos
  ),

  // Cache para post individual
  getPost: createCachedFunction(
    async (_slug: string) => {
      return null as BlogPost | null;
    },
    (slug) => `blog-post-${slug}`,
    600 // 10 minutos
  ),

  // Cache para posts destacados
  getFeaturedPosts: createCachedFunction(
    async () => {
      return [] as BlogPost[];
    },
    () => "featured-posts",
    300 // 5 minutos
  ),

  // Invalidar todo el cache de blog
  invalidateAll: () => {
    invalidateCache("blog-");
  },

  // Invalidar cache específico
  invalidatePost: (slug: string) => {
    memoryCache.delete(`blog-post-${slug}`);
    invalidateCache("blog-posts-");
    invalidateCache("featured-posts");
  },
};

/**
 * Cache para comentarios
 */
export const commentsCache = {
  getComments: createCachedFunction(
    async (_postId: string) => {
      return [] as Comment[];
    },
    (postId) => `comments-${postId}`,
    60 // 1 minuto
  ),

  invalidatePost: (postId: string) => {
    memoryCache.delete(`comments-${postId}`);
  },
};

/**
 * Utilidades de cache
 */
export const cacheUtils = {
  // Obtener estadísticas del cache
  getStats: () => {
    const cache = memoryCache["cache"];
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  },

  // Limpiar todo el cache
  clearAll: () => {
    memoryCache.clear();
  },

  // Precalentar cache con datos importantes
  warmup: async () => {
    try {
      // Precargar posts destacados y recientes
      await blogCache.getFeaturedPosts();
      console.warn("Cache warmed up successfully");
    } catch (error) {
      console.error("Cache warmup failed:", error);
    }
  },
};
