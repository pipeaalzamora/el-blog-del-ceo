import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección de información */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              El Blog del CEO
            </h3>
            <p className="text-muted-foreground mb-4">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el mundo de los negocios.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contacto@elblogdelceo.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación rápida */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/personal"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog Personal
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/startup"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Startup
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Newsletter
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Suscríbete para recibir las últimas reflexiones sobre liderazgo y
              emprendimiento.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} El Blog del CEO & FOUNDER. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
