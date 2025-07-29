import Newsletter from "./Newsletter";
import { Crown, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-muted/20 via-muted/10 to-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Sección de información */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <Crown className="w-8 h-8 text-primary" />
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                El Blog del CEO & FOUNDER
              </h3>
              <Sparkles className="w-5 h-5 text-primary/60 animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el mundo de los negocios. Contenido exclusivo para líderes y
              emprendedores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Liderazgo
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Innovación
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Emprendimiento
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center lg:text-left">
            <Newsletter />
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} El Blog del CEO & FOUNDER. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
