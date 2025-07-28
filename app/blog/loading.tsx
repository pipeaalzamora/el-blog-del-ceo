import BlogCardSkeleton from "@/components/BlogCardSkeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <section className="bg-gradient-to-r from-foreground to-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full w-20 h-20 animate-pulse" />
            </div>
            <div className="h-12 bg-white/20 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Posts skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-muted rounded-lg w-1/3 mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-1/4 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
