"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const updateContent = async () => {
    setIsUpdating(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/webhook?secret=default-secret");
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setLastUpdate(new Date().toLocaleString());
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto bg-card rounded-xl border p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          🔄 Admin Panel
        </h1>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Actualiza el contenido del blog desde Notion
            </p>

            <button
              onClick={updateContent}
              disabled={isUpdating}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isUpdating ? "animate-spin" : ""}`}
              />
              {isUpdating ? "Actualizando..." : "Actualizar Contenido"}
            </button>
          </div>

          {status === "success" && (
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 dark:text-green-200 text-sm">
                ¡Contenido actualizado exitosamente!
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 dark:text-red-200 text-sm">
                Error al actualizar. Inténtalo de nuevo.
              </span>
            </div>
          )}

          {lastUpdate && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Última actualización: {lastUpdate}
              </p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-2">
              💡 Automatización:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • El contenido se actualiza automáticamente cada 5 minutos
              </li>
              <li>• Usa este botón para forzar actualizaciones inmediatas</li>
              <li>
                • Los cambios aparecen en 1-2 minutos después de actualizar
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
