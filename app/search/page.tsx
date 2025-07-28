"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import { BlogPost } from "@/lib/types";
import { Search, Filter, X } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("all");

  // Fetch search results
  const performSearch = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(
            searchQuery
          )}&category=${category}`
        );
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error searching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setPosts([]);
    }
  }, [query, performSearch]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearFilters = () => {
    setCategory("all");
    setQuery("");
  };

  const filteredPosts =
    category === "all"
      ? posts
      : posts.filter((post) => post.category === category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-foreground to-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Search className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Buscar Posts
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Encuentra el contenido que buscas en nuestro blog
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Buscar por título, contenido, tags o autor..."
                className="max-w-2xl"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas las categorías</option>
                <option value="personal">Personal</option>
                <option value="startup">Emprendimiento</option>
              </select>

              {(query || category !== "all") && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            {query && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Resultados de búsqueda
                </h2>
                <span className="text-muted-foreground">
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>
            )}

            {query && (
              <p className="text-muted-foreground">
                Buscando:{" "}
                <span className="font-medium text-foreground">
                  &quot;{query}&quot;
                </span>
                {category !== "all" && (
                  <span>
                    {" "}
                    en{" "}
                    <span className="font-medium text-foreground">
                      {category === "personal" ? "Personal" : "Emprendimiento"}
                    </span>
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && (
            <>
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-16">
                  <div className="bg-card rounded-xl border p-12 max-w-lg mx-auto">
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      No se encontraron resultados
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      No encontramos posts que coincidan con tu búsqueda.
                      Intenta con otros términos o revisa la ortografía.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Ver todos los posts
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-card rounded-xl border p-12 max-w-lg mx-auto">
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Comienza tu búsqueda
                    </h3>
                    <p className="text-muted-foreground">
                      Escribe en la barra de búsqueda para encontrar contenido
                      relevante.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
