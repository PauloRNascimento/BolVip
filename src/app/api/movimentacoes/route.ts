import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
      orderBy: { data: "desc" },
    });

    return NextResponse.json(movimentacoes);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar movimentações" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { tipo, valor, descricao, data } = body;

    if (!tipo || !valor || !descricao) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
      return NextResponse.json({ error: "Tipo deve ser 'entrada' ou 'saida'" }, { status: 400 });
    }

    const movimentacao = await prisma.movimentacao.create({
      data: {
        tipo,
        valor: Number(valor),
        descricao,
        data: data ? new Date(data) : new Date(),
      },
    });

    return NextResponse.json(movimentacao, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar movimentação" }, { status: 500 });
  }
}
