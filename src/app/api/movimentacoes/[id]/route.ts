import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movimentacao = await prisma.movimentacao.findUnique({ where: { id } });

    if (!movimentacao) {
      return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 });
    }

    return NextResponse.json(movimentacao);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar movimentação" }, { status: 500 });
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

    const movimentacao = await prisma.movimentacao.update({
      where: { id },
      data: {
        ...(body.tipo && { tipo: body.tipo }),
        ...(body.valor !== undefined && { valor: Number(body.valor) }),
        ...(body.descricao && { descricao: body.descricao }),
        ...(body.data && { data: new Date(body.data) }),
      },
    });

    return NextResponse.json(movimentacao);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar movimentação" }, { status: 500 });
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
    await prisma.movimentacao.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar movimentação" }, { status: 500 });
  }
}
