import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBlogPostBySlug, getBlogPostById } from "@/lib/notion";

// Webhook secret para validar requests (configurar en variables de entorno)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "default-secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook recibido:", body);

    // Verificar si es un evento de verificación de Notion
    if (body.type === "url_verification") {
      console.log("Verificación de URL recibida:", body.challenge);
      return NextResponse.json({ challenge: body.challenge });
    }

    // Para eventos reales de Notion, no necesitamos validar Bearer token
    // Notion usa su propio sistema de autenticación
    console.log("Evento de Notion procesado:", body);

    // Revalidar todas las rutas relacionadas con blog
    revalidateTag("blog-posts");

    // Si es un post nuevo o actualizado, enviar newsletter
    if (body.type === "page_updated" || body.type === "page_created") {
      try {
        // Obtener el post actualizado
        const pageId = body.page?.id;
        if (pageId) {
          console.log("Post actualizado/creado:", pageId);

          // Obtener el post completo
          const post = await getBlogPostById(pageId);

          if (post && post.isPublished) {
            console.log("Enviando newsletter para post:", post.title);

            // Enviar newsletter automáticamente
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/newsletter/send`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  post,
                  category: post.category,
                }),
              }
            );

            if (response.ok) {
              const result = await response.json();
              console.log("Newsletter enviado exitosamente:", result);
            } else {
              console.error(
                "Error enviando newsletter:",
                await response.text()
              );
            }
          } else {
            console.log("Post no encontrado o no publicado:", pageId);
          }
        }
      } catch (newsletterError) {
        console.error("Error enviando newsletter:", newsletterError);
        // No fallamos el webhook por errores de newsletter
      }
    }

    return NextResponse.json({
      message: "Revalidation triggered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Permitir GET para testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidar para testing
  revalidateTag("blog-posts");

  return NextResponse.json({
    message: "Manual revalidation triggered",
    timestamp: new Date().toISOString(),
  });
}
