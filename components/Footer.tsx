import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección de información */}
          <div>
            <h3 className="text-lg font-semibold mb-4">El Blog del CEO</h3>
            <p className="text-gray-300 mb-4">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el mundo de los negocios.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contacto@elblogdelceo.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación rápida */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/personal"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog Personal
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/electric-automatic"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Electric Automatic
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          {/* Electric Automatic Chile */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Electric Automatic Chile
            </h3>
            <p className="text-gray-300 mb-4">
              Innovación en automatización eléctrica y soluciones industriales.
            </p>
            <a
              href="https://www.electricautomaticchile.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
            >
              Visitar sitio web
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © {currentYear} El Blog del CEO. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Desarrollado con ❤️ usando Next.js y Notion
          </p>
        </div>
      </div>
    </footer>
  );
}
