"use client";
import { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
          categories: ["all"], // Por defecto suscribir a todos los posts
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "Error al suscribirse");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 text-center">
        <Check className="w-10 h-10 mx-auto text-primary mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          ¡Suscripción exitosa!
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Recibirás los nuevos posts en tu email.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
        >
          Suscribir otro email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card via-card to-muted/30 border border-border rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold text-foreground mb-2">
          ¡No te pierdas nada!
        </h3>
        <p className="text-muted-foreground text-sm">
          Recibe los nuevos posts directamente en tu email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background/50 transition-all duration-200"
            required
          />
          <button
            type="submit"
            disabled={submitting || !email}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            ) : (
              "Suscribirse"
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Sin spam. Cancela cuando quieras.
        </p>
      </form>
    </div>
  );
}
