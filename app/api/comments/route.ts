import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments } from "@/lib/db";
import { CommentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId es requerido" },
        { status: 400 }
      );
    }

    const comments = await getComments(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validationResult = CommentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { postId, nickname, content } = validationResult.data;

    // Filtro básico de spam
    const spamWords = ["spam", "casino", "viagra", "loan", "credit"];
    const hasSpam = spamWords.some((word) =>
      content.toLowerCase().includes(word)
    );

    if (hasSpam) {
      return NextResponse.json(
        { error: "El comentario contiene contenido no permitido" },
        { status: 400 }
      );
    }

    const comment = await addComment({
      postId,
      nickname: nickname || "Anónimo",
      content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
