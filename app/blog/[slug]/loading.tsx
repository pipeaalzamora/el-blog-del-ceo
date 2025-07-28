export default function PostLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="relative h-96 bg-muted animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-4 bg-white/20 rounded w-32 mb-4 animate-pulse" />
            <div className="h-12 bg-white/20 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-white/20 rounded-lg w-3/4 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Metadatos skeleton */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
            <div className="w-32 h-4 bg-muted rounded animate-pulse" />
            <div className="w-28 h-4 bg-muted rounded animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-16 h-6 bg-muted rounded-md animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded-md animate-pulse" />
            <div className="w-14 h-6 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="bg-card py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-6 bg-muted rounded w-4/6 animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-4/6 animate-pulse" />
            <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-6 bg-muted rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
