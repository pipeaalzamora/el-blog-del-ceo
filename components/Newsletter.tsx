"use client";
import { useState } from "react";
import { Mail, Check, AlertCircle, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<
    ("personal" | "startup" | "all")[]
  >(["all"]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || categories.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          categories,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setCategories(["all"]);
      } else {
        setError(data.error || "Error al suscribirse");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (category: "personal" | "startup" | "all") => {
    if (category === "all") {
      setCategories(["all"]);
    } else {
      setCategories((prev) => {
        const filtered = prev.filter((cat) => cat !== "all");
        if (filtered.includes(category)) {
          return filtered.filter((cat) => cat !== category);
        } else {
          return [...filtered, category];
        }
      });
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="relative">
          <Check className="w-12 h-12 mx-auto text-primary mb-4" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-primary/60 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">
          ¡Suscripción exitosa!
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Te has suscrito al newsletter. Recibirás notificaciones cuando
          publiquemos nuevos posts directamente en tu email.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Suscribir otro email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card via-card to-muted/30 border border-border rounded-2xl p-8 shadow-lg backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <Mail className="w-12 h-12 text-primary" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-primary/60 animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          ¡No te pierdas nada!
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Suscríbete al newsletter y recibe los nuevos posts directamente en tu
          email. Contenido exclusivo sobre liderazgo y emprendimiento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-foreground mb-3"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background/50 backdrop-blur-sm transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-4">
            Categorías de interés *
          </label>
          <div className="space-y-4">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes("all")}
                onChange={() => handleCategoryChange("all")}
                className="w-5 h-5 text-primary border-border rounded-lg focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="ml-3 text-foreground group-hover:text-primary transition-colors duration-200 font-medium">
                Todos los posts
              </span>
            </label>
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes("personal")}
                onChange={() => handleCategoryChange("personal")}
                className="w-5 h-5 text-primary border-border rounded-lg focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="ml-3 text-foreground group-hover:text-primary transition-colors duration-200 font-medium">
                Posts personales
              </span>
            </label>
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes("startup")}
                onChange={() => handleCategoryChange("startup")}
                className="w-5 h-5 text-primary border-border rounded-lg focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="ml-3 text-foreground group-hover:text-primary transition-colors duration-200 font-medium">
                Posts de emprendimiento
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !email || categories.length === 0}
          className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Suscribiendo...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Suscribirse al newsletter
            </span>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Puedes cancelar tu suscripción en cualquier momento. No compartimos tu
          email con terceros. Recibirás contenido exclusivo sobre liderazgo y
          emprendimiento.
        </p>
      </form>
    </div>
  );
}
