import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { NewsletterSubscriber } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriber } = body;

    if (!subscriber || !subscriber.email) {
      return NextResponse.json(
        { error: "Subscriber data is required" },
        { status: 400 }
      );
    }

    const emailHtml = createWelcomeEmailTemplate(subscriber);
    const subject = "¡Bienvenido al Newsletter de El Blog del CEO!";

    // Configuración para envío de emails
    // Usando el dominio verificado: electricautomaticchile.com
    const fromEmail = "El Blog del CEO <newsletter@electricautomaticchile.com>";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: subscriber.email, // Enviar al email real del suscriptor
      subject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error enviando email de bienvenida:", error);
      return NextResponse.json(
        { error: "Error enviando email de bienvenida", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email de bienvenida enviado exitosamente",
      id: data?.id,
    });
  } catch (error) {
    console.error("Error en welcome email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function createWelcomeEmailTemplate(subscriber: NewsletterSubscriber): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://elblogdelceo.com";
  const categoriesText = subscriber.categories
    .map((cat) => {
      switch (cat) {
        case "personal":
          return "Posts personales";
        case "startup":
          return "Posts de emprendimiento";
        case "all":
          return "Todos los posts";
        default:
          return cat;
      }
    })
    .join(", ");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido al Newsletter!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">¡Bienvenido a El Blog del CEO!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu suscripción ha sido confirmada</p>
      </div>

      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 22px;">¡Gracias por suscribirte!</h2>
        <p style="color: #718096; margin: 0 0 20px 0; font-size: 16px;">
          Hola, nos alegra que te hayas unido a nuestra comunidad. Recibirás notificaciones cuando publiquemos nuevos posts sobre los temas que te interesan.
        </p>

        <div style="background: #e2e8f0; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin: 0 0 10px 0; font-size: 18px;">Categorías suscritas:</h3>
          <p style="color: #718096; margin: 0; font-size: 16px;">${categoriesText}</p>
        </div>

        <p style="color: #718096; margin: 0 0 20px 0; font-size: 16px;">
          Te enviaremos emails cada vez que publiquemos contenido nuevo en estas categorías.
        </p>

        <a href="${siteUrl}"
           style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background 0.3s;">
          Visitar el blog →
        </a>
      </div>

      <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 14px; margin: 0;">
          Si no quieres recibir más emails, puedes cancelar tu suscripción en cualquier momento.
        </p>
        <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">
          <a href="${siteUrl}/newsletter/unsubscribe" style="color: #667eea;">Cancelar suscripción</a>
        </p>
      </div>
    </body>
    </html>
  `;
}
