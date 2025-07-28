import { getFeaturedPosts, getRecentPosts } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { ArrowRight, Star, Clock, Building2, User } from "lucide-react";

export default async function Home() {
  // Obtener posts de Notion
  const featuredPosts = await getFeaturedPosts();
  const recentPosts = await getRecentPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-foreground via-foreground/90 to-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              El Blog del CEO
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 max-w-3xl mx-auto">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el futuro de los negocios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog/personal"
                className="inline-flex items-center px-6 py-3 bg-background text-primary rounded-lg font-medium hover:bg-background/90 transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Blog Personal
              </Link>
              <Link
                href="/blog/startup"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Blog de Emprendimiento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-3xl font-bold text-foreground">
                  Posts Destacados
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-3xl font-bold text-foreground">
                Publicaciones Recientes
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-card rounded-lg border p-8 max-w-md mx-auto">
                <div className="text-muted-foreground mb-4">
                  <Clock className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ¡Pronto habrá contenido!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estamos preparando contenido increíble para ti. Mientras
                  tanto, puedes configurar tu base de datos de Notion.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Ver blog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
