import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bolaoId = searchParams.get("bolaoId");

    const where = bolaoId ? { bolaoId } : {};

    const jogos = await prisma.jogo.findMany({
      where,
      include: { bolao: { select: { nome: true, tipoJogo: true } } },
      orderBy: { dataSorteio: "desc" },
    });

    return NextResponse.json(jogos);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar jogos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { numeros, dataSorteio, bolaoId, quantNumeros, origem, numeroConcurso } = body;

    if (!numeros || !dataSorteio || !bolaoId) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const jogo = await prisma.jogo.create({
      data: {
        numeros,
        dataSorteio: new Date(dataSorteio),
        bolaoId,
        quantNumeros: quantNumeros ? Number(quantNumeros) : 6,
        origem: origem || "online",
        numeroConcurso: numeroConcurso || null,
      },
    });

    return NextResponse.json(jogo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 });
  }
}
