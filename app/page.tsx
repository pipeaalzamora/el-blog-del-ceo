import { getFeaturedPosts, getRecentPosts } from "@/lib/notion";
import { BlogPost } from "@/lib/types";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { ArrowRight, Star, Clock, Building2, User } from "lucide-react";

export default async function Home() {
  // En desarrollo, usaremos datos de ejemplo
  const featuredPosts: BlogPost[] = [];
  const recentPosts: BlogPost[] = [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              El Blog del CEO
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el futuro de los negocios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog/personal"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Blog Personal
              </Link>
              <Link
                href="/blog/electric-automatic"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Electric Automatic
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">
                Publicaciones Recientes
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
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
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Clock className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡Pronto habrá contenido!
                </h3>
                <p className="text-gray-600 mb-6">
                  Estamos preparando contenido increíble para ti. Mientras
                  tanto, puedes configurar tu base de datos de Notion.
                </p>
                <Link
                  href="#setup"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver configuración
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Personal Section */}
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <User className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Blog Personal
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Reflexiones personales sobre liderazgo, crecimiento profesional,
                y las lecciones aprendidas en el camino del emprendimiento.
              </p>
              <Link
                href="/blog/personal"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Explorar blog personal
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Electric Automatic Section */}
            <div className="bg-green-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Building2 className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Electric Automatic Chile
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Insights sobre la industria de automatización eléctrica,
                innovación tecnológica y el futuro de las soluciones
                industriales en Chile.
              </p>
              <div className="space-y-3">
                <Link
                  href="/blog/electric-automatic"
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium block"
                >
                  Blog de la empresa
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <a
                  href="https://www.electricautomaticchile.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium block"
                >
                  Sitio web oficial
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup" className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              🚀 Configuración de Notion CMS
            </h2>
            <p className="text-gray-300 text-lg">
              Para que tu blog funcione, necesitas configurar la integración con
              Notion
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6">
              Pasos para configurar:
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-semibold mb-2">
                    Crear una integración en Notion
                  </h4>
                  <p className="text-gray-300">
                    Ve a{" "}
                    <a
                      href="https://www.notion.so/my-integrations"
                      className="text-blue-400 hover:underline"
                    >
                      notion.so/my-integrations
                    </a>{" "}
                    y crea una nueva integración.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-semibold mb-2">
                    Crear base de datos en Notion
                  </h4>
                  <p className="text-gray-300">
                    Crea una base de datos con estas propiedades: Título
                    (Title), Resumen (Text), Categoría (Select), Tags
                    (Multi-select), Publicado (Checkbox), Fecha (Date), Autor
                    (Text).
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-semibold mb-2">
                    Configurar variables de entorno
                  </h4>
                  <p className="text-gray-300">
                    Crea un archivo{" "}
                    <code className="bg-gray-700 px-2 py-1 rounded">
                      .env.local
                    </code>{" "}
                    con:
                  </p>
                  <pre className="bg-gray-700 p-4 rounded mt-2 text-sm overflow-x-auto">
                    {`NOTION_TOKEN=tu_token_de_integracion
NOTION_DATABASE_ID=id_de_tu_base_de_datos`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
