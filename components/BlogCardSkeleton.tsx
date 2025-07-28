export default function BlogCardSkeleton() {
  return (
    <article className="group relative bg-card rounded-xl border overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-48 bg-muted" />

      <div className="p-6">
        {/* Categoría y metadatos skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-20 h-6 bg-muted rounded-full" />
          <div className="flex items-center space-x-4">
            <div className="w-12 h-4 bg-muted rounded" />
            <div className="w-8 h-4 bg-muted rounded" />
          </div>
        </div>

        {/* Título skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/2" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-4 bg-muted rounded" />
            <div className="w-20 h-4 bg-muted rounded" />
          </div>
          <div className="w-20 h-4 bg-muted rounded" />
        </div>

        {/* Tags skeleton */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <div className="w-12 h-6 bg-muted rounded-md" />
            <div className="w-16 h-6 bg-muted rounded-md" />
            <div className="w-14 h-6 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
}
