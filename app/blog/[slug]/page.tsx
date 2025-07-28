import { getBlogPostBySlug, getBlogPosts } from "@/lib/notion";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post no encontrado - El Blog del CEO",
    };
  }

  return {
    title: `${post.title} - El Blog del CEO`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

// Generar rutas estáticas para mejor rendimiento
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generando rutas estáticas:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryConfig = {
    personal: {
      label: "Personal",
      color: "bg-primary/10 text-primary",
      bgColor: "bg-muted/50",
      textColor: "text-primary",
      backLink: "/blog/personal",
    },
    startup: {
      label: "Emprendimiento",
      color: "bg-primary/10 text-primary",
      bgColor: "bg-muted/50",
      textColor: "text-primary",
      backLink: "/blog/startup",
    },
  };

  const config = categoryConfig[post.category];

  return (
    <div className="min-h-screen bg-background">
      {/* Header con imagen de portada */}
      <article>
        {post.coverImage ? (
          <div className="relative h-96 bg-black">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-80"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <Link
                  href={config.backLink}
                  className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a {config.label}
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-xl text-white/90 max-w-3xl">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`${config.bgColor} py-16`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href={config.backLink}
                className={`inline-flex items-center ${config.textColor} hover:opacity-80 mb-6 transition-opacity`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a {config.label}
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Metadatos del post */}
        <div className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(post.publishedAt), "dd MMMM yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.readingTime} min de lectura</span>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
              >
                {config.label}
              </span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenido del post */}
        <div className="bg-card py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none blog-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-3xl font-bold text-foreground mb-6 mt-8">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-2xl font-bold text-foreground mb-4 mt-6">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-xl font-bold text-foreground mb-3 mt-5">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary hover:text-primary/80 underline"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-6 py-4 mb-6 text-muted-foreground italic bg-primary/10 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-foreground text-background p-6 rounded-lg overflow-x-auto mb-6">
                      {children}
                    </pre>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`${config.bgColor} py-12`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¿Te gustó este artículo?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {post.category === "personal"
                ? "Comparte tus reflexiones y sígueme para más contenido sobre liderazgo y emprendimiento."
                : "Descubre más sobre innovación tecnológica y emprendimiento exitoso."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={config.backLink}
                className={`inline-flex items-center px-6 py-3 ${config.textColor} border-2 border-current rounded-lg font-medium hover:bg-current hover:text-primary-foreground transition-colors`}
              >
                Ver más artículos
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
