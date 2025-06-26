import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Webhook secret para validar requests (configurar en variables de entorno)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "default-secret";

export async function POST(request: NextRequest) {
  try {
    // Validar el secret del webhook
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Webhook recibido:", body);

    // Revalidar todas las rutas relacionadas con blog
    revalidateTag("blog-posts");

    // También podemos usar revalidatePath para rutas específicas
    // revalidatePath('/');
    // revalidatePath('/blog');
    // revalidatePath('/blog/personal');
    // revalidatePath('/blog/startup');

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
