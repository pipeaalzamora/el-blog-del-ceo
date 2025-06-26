import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Sección de información */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
              El Blog del CEO & FOUNDER
            </h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
              Reflexiones personales y empresariales sobre liderazgo, innovación
              y el mundo de los negocios.
            </p>
          </div>

          {/* Newsletter */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
              Newsletter
            </h3>
            <p className="text-muted-foreground mb-4 text-sm max-w-sm mx-auto lg:mx-0">
              Suscríbete para recibir las últimas reflexiones sobre liderazgo y
              emprendimiento.
            </p>
            <form className="space-y-3 max-w-sm mx-auto lg:mx-0">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {currentYear} El Blog del CEO & FOUNDER. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
