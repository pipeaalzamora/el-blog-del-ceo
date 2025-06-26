import { getBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/lib/types";
import BlogCard from "@/components/BlogCard";
import { User, Calendar, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Blog Personal - El Blog del CEO",
  description:
    "Reflexiones personales sobre liderazgo, crecimiento profesional y emprendimiento.",
};

export default async function PersonalBlogPage() {
  // En desarrollo, usaremos datos de ejemplo
  const posts: BlogPost[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <User className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Personal
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Reflexiones personales sobre liderazgo, crecimiento profesional y
              las lecciones aprendidas en el camino del emprendimiento.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Todas las publicaciones
                </h2>
                <p className="text-gray-600">
                  {posts.length}{" "}
                  {posts.length === 1 ? "publicación" : "publicaciones"}
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
              <div className="bg-white rounded-xl shadow-md p-12 max-w-lg mx-auto">
                <div className="text-gray-400 mb-6">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Pronto habrá contenido personal!
                </h3>
                <p className="text-gray-600 mb-8">
                  Estoy preparando reflexiones profundas sobre liderazgo,
                  emprendimiento y crecimiento personal. Mantente atento.
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Próximos temas:
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Lecciones de liderazgo</li>
                      <li>• Construcción de equipos</li>
                      <li>• Mindset emprendedor</li>
                      <li>• Balance vida-trabajo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Te gustaría recibir mis reflexiones?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Suscríbete para recibir mis pensamientos más recientes sobre
            liderazgo y emprendimiento directamente en tu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Suscribirse
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            Sin spam. Solo contenido de valor. Cancela cuando quieras.
          </p>
        </div>
      </section>
    </div>
  );
}
