import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBlogPostById } from "@/lib/notion";
import { getSubscribers } from "@/lib/db";
import { Resend } from "resend";
import { BlogPost } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

// Función para crear el template del email de newsletter
function createNewsletterEmailTemplate(post: BlogPost, subscriberEmail: string) {
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://elblogdelceo.com"}/blog/${post.slug}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Post: ${post.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .post-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #2d3748; }
        .post-excerpt { font-size: 16px; color: #4a5568; margin-bottom: 20px; line-height: 1.6; }
        .post-meta { font-size: 14px; color: #718096; margin-bottom: 25px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; }
        .category-badge { display: inline-block; background: #e2e8f0; color: #4a5568; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .reading-time { display: inline-block; background: #f7fafc; color: #718096; padding: 4px 12px; border-radius: 15px; font-size: 12px; margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🚀 El Blog del CEO</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nuevo contenido exclusivo para líderes y emprendedores</p>
        </div>

        <div class="content">
          <div class="category-badge">
            ${post.category === "startup" ? "🏢 Emprendimiento" : "👤 Personal"}
          </div>

          <h2 class="post-title">${post.title}</h2>

          <div class="post-meta">
            <span>📅 ${new Date(post.publishedAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
            <span class="reading-time">⏱️ ${post.readingTime} min de lectura</span>
          </div>

          <p class="post-excerpt">${post.excerpt}</p>

          <a href="${postUrl}" class="cta-button">Leer artículo completo →</a>

          <div class="footer">
            <p>Gracias por suscribirte a nuestro newsletter.</p>
            <p>Si no quieres recibir más emails, puedes <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://elblogdelceo.com"}/unsubscribe?email=${subscriberEmail}" style="color: #667eea;">darte de baja aquí</a>.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
              © ${new Date().getFullYear()} El Blog del CEO. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Webhook secret para validar requests (configurar en variables de entorno)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "default-secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.warn("Webhook recibido:", body);

    // Verificar si es un evento de verificación de Notion
    if (body.type === "url_verification") {
      console.warn("Verificación de URL recibida:", body.challenge);
      return NextResponse.json({ challenge: body.challenge });
    }

    // Para eventos reales de Notion, no necesitamos validar Bearer token
    // Notion usa su propio sistema de autenticación
    console.warn("Evento de Notion procesado:", body);

    // Revalidar todas las rutas relacionadas con blog
    revalidateTag("blog-posts");

    // Si es un post nuevo o actualizado, enviar newsletter
    if (body.type === "page_updated" || body.type === "page_created") {
      try {
        // Obtener el post actualizado
        const pageId = body.page?.id;
        if (pageId) {
          console.warn("Post actualizado/creado:", pageId);

          // Obtener el post completo
          const post = await getBlogPostById(pageId);

          if (post && post.isPublished) {
            console.warn("Enviando newsletter para post:", post.title);

            try {
              // Obtener suscriptores activos
              const subscribers = await getSubscribers();

              // Filtrar suscriptores según la categoría del post
              const relevantSubscribers = subscribers.filter(
                (subscriber) =>
                  subscriber.isActive &&
                  (subscriber.categories.includes("all") ||
                    subscriber.categories.includes(post.category))
              );

              if (relevantSubscribers.length === 0) {
                console.warn("No hay suscriptores activos para esta categoría");
                return;
              }

              let sentCount = 0;
              const errors: string[] = [];

              // Enviar email a cada suscriptor relevante
              for (const subscriber of relevantSubscribers) {
                try {
                  const emailHtml = createNewsletterEmailTemplate(
                    post,
                    subscriber.email
                  );
                  const subject = `📰 Nuevo Post: ${post.title}`;
                  const fromEmail =
                    "El Blog del CEO <newsletter@electricautomaticchile.com>";

                  const { error } = await resend.emails.send({
                    from: fromEmail,
                    to: subscriber.email,
                    subject,
                    html: emailHtml,
                  });

                  if (error) {
                    console.error(
                      `Error enviando email a ${subscriber.email}:`,
                      error
                    );
                    errors.push(`${subscriber.email}: ${error.message}`);
                  } else {
                    console.warn(
                      `Email enviado exitosamente a ${subscriber.email}`
                    );
                    sentCount++;
                  }

                  // Pequeña pausa entre emails para evitar rate limiting
                  await new Promise((resolve) => setTimeout(resolve, 100));
                } catch (error) {
                  console.error(
                    `Error procesando suscriptor ${subscriber.email}:`,
                    error
                  );
                  errors.push(`${subscriber.email}: Error interno`);
                }
              }

              console.warn(
                `Newsletter enviado: ${sentCount}/${relevantSubscribers.length} emails enviados`
              );
              if (errors.length > 0) {
                console.error("Errores:", errors);
              }
            } catch (newsletterError) {
              console.error(
                "Error en el proceso de newsletter:",
                newsletterError
              );
            }
          } else {
            console.warn("Post no encontrado o no publicado:", pageId);
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
