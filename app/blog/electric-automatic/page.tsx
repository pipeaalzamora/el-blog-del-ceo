import { getBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/lib/types";
import BlogCard from "@/components/BlogCard";
import { Building2, Zap, ExternalLink, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Electric Automatic Chile - El Blog del CEO",
  description:
    "Insights sobre automatización eléctrica, innovación tecnológica y el futuro de las soluciones industriales en Chile.",
};

export default async function ElectricAutomaticBlogPage() {
  // En desarrollo, usaremos datos de ejemplo
  const posts: BlogPost[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Building2 className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Electric Automatic Chile
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-6">
              Innovación en automatización eléctrica y soluciones industriales.
              Compartiendo insights sobre tecnología, industria y el futuro de
              Chile.
            </p>
            <a
              href="https://www.electricautomaticchile.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Visitar sitio web
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Automatización Eléctrica
              </h3>
              <p className="text-gray-600">
                Soluciones innovadoras para la industria moderna
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Innovación Tecnológica
              </h3>
              <p className="text-gray-600">
                Desarrollando el futuro de la automatización
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Soluciones Industriales
              </h3>
              <p className="text-gray-600">
                Transformando la industria chilena
              </p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Insights de la industria
                </h2>
                <p className="text-gray-600">
                  {posts.length} {posts.length === 1 ? "artículo" : "artículos"}{" "}
                  sobre automatización e innovación
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
                  <Building2 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Pronto tendremos insights de la industria!
                </h3>
                <p className="text-gray-600 mb-8">
                  Estamos preparando contenido valioso sobre automatización
                  eléctrica, innovación tecnológica y el futuro de la industria
                  en Chile.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Próximos temas:
                    </h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Tendencias en automatización industrial</li>
                      <li>• Casos de éxito en Chile</li>
                      <li>• Innovaciones tecnológicas</li>
                      <li>• Sostenibilidad energética</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Company CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas soluciones de automatización?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Electric Automatic Chile ofrece soluciones integrales de
            automatización eléctrica para modernizar tu industria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.electricautomaticchile.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Conocer servicios
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
              Contactar ahora
            </button>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Acerca de Electric Automatic Chile
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Somos una empresa pionera en automatización eléctrica,
              comprometida con la innovación y la transformación digital de la
              industria chilena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Nuestra Misión
              </h3>
              <p className="text-gray-600">
                Transformar la industria chilena a través de soluciones de
                automatización eléctrica innovadoras, eficientes y sostenibles.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Nuestra Visión
              </h3>
              <p className="text-gray-600">
                Ser la empresa líder en automatización eléctrica en Chile,
                impulsando la transformación digital de la industria nacional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
