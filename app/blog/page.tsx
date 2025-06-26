import { getBlogPosts } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";
import { BookOpen, Filter } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Todos los artículos - El Blog del CEO",
  description:
    "Explora todos los artículos sobre liderazgo, emprendimiento y automatización eléctrica.",
};

export default async function AllBlogsPage() {
  // Obtener todos los posts
  const allPosts = await getBlogPosts();

  // Separar por categorías
  const personalPosts = allPosts.filter((post) => post.category === "personal");
  const startupPosts = allPosts.filter((post) => post.category === "startup");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-foreground to-foreground/80 text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Todos los Artículos
            </h1>
            <p className="text-xl text-background/80 max-w-2xl mx-auto">
              Explora todas las reflexiones sobre liderazgo, emprendimiento y
              las últimas innovaciones en automatización eléctrica.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros rápidos */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-muted-foreground mr-2" />
              <span className="text-muted-foreground font-medium">
                Filtrar por categoría:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 bg-foreground text-background rounded-lg font-medium"
              >
                Todos ({allPosts.length})
              </Link>
              <Link
                href="/blog/personal"
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                Personal ({personalPosts.length})
              </Link>
              <Link
                href="/blog/startup"
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                Startup ({startupPosts.length})
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {allPosts.length > 0 ? (
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Todas las publicaciones
                </h2>
                <p className="text-muted-foreground">
                  {allPosts.length}{" "}
                  {allPosts.length === 1
                    ? "artículo publicado"
                    : "artículos publicados"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card rounded-xl border p-12 max-w-lg mx-auto">
                <div className="text-muted-foreground mb-6">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  ¡Pronto habrá contenido!
                </h3>
                <p className="text-muted-foreground mb-8">
                  Estamos preparando contenido increíble sobre liderazgo,
                  emprendimiento y automatización eléctrica.
                </p>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">
                      Próximos temas:
                    </h4>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Reflexiones sobre liderazgo</li>
                      <li>• Casos de éxito empresarial</li>
                      <li>• Innovaciones en automatización</li>
                      <li>• Tendencias tecnológicas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
