import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const boloes = await prisma.bolao.findMany({
      where,
      include: {
        _count: { select: { jogos: true, resultados: true } },
      },
      orderBy: { dataSorteio: "desc" },
    });

    return NextResponse.json(boloes);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar bolões" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, tipoJogo, dataSorteio, valorCota, totalCotas, status } = body;

    if (!nome || !tipoJogo || !dataSorteio || !valorCota || !totalCotas) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const bolao = await prisma.bolao.create({
      data: {
        nome,
        tipoJogo,
        dataSorteio: new Date(dataSorteio),
        valorCota: Number(valorCota),
        totalCotas: Number(totalCotas),
        status: status || "aberto",
      },
    });

    return NextResponse.json(bolao, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar bolão" }, { status: 500 });
  }
}
