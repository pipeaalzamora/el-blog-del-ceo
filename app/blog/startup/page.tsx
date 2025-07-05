import { getBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/lib/types";
import BlogCard from "@/components/BlogCard";
import { Building2, Zap, ExternalLink, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Blog de Emprendimiento - El Blog del CEO",
  description:
    "Insights sobre emprendimiento, innovación tecnológica y el desarrollo de startups exitosas.",
};

export default async function StartupBlogPage() {
  // Obtener posts de la categoría startup
  const posts = await getBlogPosts("startup");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-foreground to-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Building2 className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog de Emprendimiento
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-6">
              Compartiendo insights sobre startups, innovación tecnológica y las
              lecciones aprendidas en el camino emprendedor.
            </p>
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
                  Insights de Emprendimiento
                </h2>
                <p className="text-muted-foreground">
                  {posts.length} {posts.length === 1 ? "artículo" : "artículos"}{" "}
                  sobre innovación y emprendimiento
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card rounded-xl border p-12 max-w-lg mx-auto">
                <div className="text-muted-foreground mb-6">
                  <Lightbulb className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  ¡Pronto tendremos insights de emprendimiento!
                </h3>
                <p className="text-muted-foreground mb-8">
                  Estamos preparando contenido valioso sobre emprendimiento,
                  innovación tecnológica y el desarrollo de startups exitosas.
                </p>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">
                      Próximos temas:
                    </h4>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Estrategias de crecimiento startup</li>
                      <li>• Desarrollo de productos digitales</li>
                      <li>• Captación de inversión</li>
                      <li>• Tendencias en tecnología emergente</li>
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
