import { getBlogPosts } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { BookOpen, Filter } from "lucide-react";

export const metadata = {
  title: "Blog - El Blog del CEO",
  description:
    "Todos los artículos sobre liderazgo, emprendimiento e innovación.",
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page, category } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const postsPerPage = 12; // 4x3 grid

  // Obtener todos los posts
  const allPosts = await getBlogPosts();

  // Filtrar por categoría si se especifica
  const filteredPosts = category
    ? allPosts.filter((post) => post.category === category)
    : allPosts;

  // Calcular paginación
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = filteredPosts.slice(startIndex, endIndex);

  // Estadísticas por categoría
  const personalPosts = allPosts.filter(
    (post) => post.category === "personal"
  ).length;
  const startupPosts = allPosts.filter(
    (post) => post.category === "startup"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-foreground to-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Completo
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Todos los artículos sobre liderazgo, emprendimiento e innovación
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {totalPosts}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de posts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {personalPosts}
                </div>
                <div className="text-sm text-muted-foreground">Personal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {startupPosts}
                </div>
                <div className="text-sm text-muted-foreground">
                  Emprendimiento
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex gap-2">
                <Link
                  href="/blog"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos
                </Link>
                <Link
                  href="/blog?category=personal"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === "personal"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Personal
                </Link>
                <Link
                  href="/blog?category=startup"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === "startup"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Emprendimiento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {category === "personal"
                    ? "Posts Personales"
                    : category === "startup"
                    ? "Posts de Emprendimiento"
                    : "Todos los Posts"}
                </h2>
                <p className="text-muted-foreground">
                  {totalPosts}{" "}
                  {totalPosts === 1 ? "publicación" : "publicaciones"}
                  {totalPages > 1 &&
                    ` • Página ${currentPage} de ${totalPages}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/blog${category ? `?category=${category}` : ""}`}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card rounded-xl border p-12 max-w-lg mx-auto">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No hay posts disponibles
                </h3>
                <p className="text-muted-foreground mb-8">
                  {category
                    ? `No hay posts en la categoría "${
                        category === "personal" ? "Personal" : "Emprendimiento"
                      }"`
                    : "Aún no hay posts publicados en el blog."}
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Ver todos los posts
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
