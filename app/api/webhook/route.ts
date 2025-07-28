import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

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

    // Validar el secret del webhook para eventos reales
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.log("Autorización fallida. Header recibido:", authHeader);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Procesar evento real de Notion
    console.log("Evento de Notion procesado:", body);

    // Revalidar todas las rutas relacionadas con blog
    revalidateTag("blog-posts");

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
