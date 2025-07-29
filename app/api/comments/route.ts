import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments } from "@/lib/db-mongodb";

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
    const { postId, nickname, content } = body;

    // Validaciones básicas
    if (!postId || !content) {
      return NextResponse.json(
        { error: "postId y content son requeridos" },
        { status: 400 }
      );
    }

    if (content.length < 3) {
      return NextResponse.json(
        { error: "El comentario debe tener al menos 3 caracteres" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "El comentario no puede exceder 1000 caracteres" },
        { status: 400 }
      );
    }

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
      content: content.trim(),
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
