import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bolaoId = searchParams.get("bolaoId");

    const where = bolaoId ? { bolaoId } : {};

    const participantes = await prisma.participante.findMany({
      where,
      include: { bolao: { select: { nome: true, tipoJogo: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(participantes);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar participantes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, chavePix, tipoPix, cotas, bolaoId } = body;

    if (!nome || !chavePix || !tipoPix || !bolaoId) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const participante = await prisma.participante.create({
      data: {
        nome,
        chavePix,
        tipoPix,
        cotas: cotas ? Number(cotas) : 1,
        bolaoId,
      },
    });

    return NextResponse.json(participante, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar participante" }, { status: 500 });
  }
}
