import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/types";
import { Calendar, Clock, User, ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryConfig = {
    personal: {
      label: "Personal",
      color: "bg-blue-100 text-blue-800",
    },
    startup: {
      label: "Emprendimiento",
      color: "bg-orange-100 text-orange-800",
    },
  };

  return (
    <article
      className={`group relative bg-card rounded-xl border hover:border-primary/20 transition-all duration-300 overflow-hidden ${
        featured ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      {/* Imagen de portada */}
      {post.coverImage && (
        <div
          className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Categoría y metadatos */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              categoryConfig[post.category].color
            }`}
          >
            {categoryConfig[post.category].label}
          </span>
          <div className="flex items-center text-gray-500 text-sm space-x-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readingTime} min
            </span>
            {post.views > 0 && (
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.views}
              </span>
            )}
          </div>
        </div>

        {/* Título */}
        <h2
          className={`font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(post.publishedAt), "dd MMM yyyy", {
                locale: es,
              })}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Leer más
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-muted-foreground text-xs">
                  +{post.tags.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Indicador de destacado */}
        {post.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Destacado
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
