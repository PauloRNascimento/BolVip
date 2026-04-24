import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bolaoId = searchParams.get("bolaoId");

    const where = bolaoId ? { bolaoId } : {};

    const resultados = await prisma.resultado.findMany({
      where,
      include: { bolao: { select: { nome: true, tipoJogo: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resultados);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { numerosSorteados, valorGanho, quantGanhadores, descricao, bolaoId } = body;

    if (!numerosSorteados || !bolaoId) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const resultado = await prisma.resultado.create({
      data: {
        numerosSorteados,
        valorGanho: Number(valorGanho) || 0,
        quantGanhadores: Number(quantGanhadores) || 0,
        descricao: descricao || null,
        bolaoId,
      },
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar resultado" }, { status: 500 });
  }
}
