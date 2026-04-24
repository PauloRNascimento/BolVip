import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resultado = await prisma.resultado.findUnique({
      where: { id },
      include: { bolao: true },
    });

    if (!resultado) {
      return NextResponse.json({ error: "Resultado não encontrado" }, { status: 404 });
    }

    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar resultado" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const resultado = await prisma.resultado.update({
      where: { id },
      data: {
        ...(body.numerosSorteados && { numerosSorteados: body.numerosSorteados }),
        ...(body.valorGanho !== undefined && { valorGanho: Number(body.valorGanho) }),
        ...(body.quantGanhadores !== undefined && { quantGanhadores: Number(body.quantGanhadores) }),
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.bolaoId && { bolaoId: body.bolaoId }),
      },
    });

    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar resultado" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.resultado.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar resultado" }, { status: 500 });
  }
}
