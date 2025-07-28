import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Cargando el blog..." />
        <p className="mt-4 text-muted-foreground">
          Preparando contenido increíble para ti...
        </p>
      </div>
    </div>
  );
}
