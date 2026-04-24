import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jogo = await prisma.jogo.findUnique({
      where: { id },
      include: { bolao: true },
    });

    if (!jogo) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(jogo);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 });
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

    const jogo = await prisma.jogo.update({
      where: { id },
      data: {
        ...(body.numeros && { numeros: body.numeros }),
        ...(body.dataSorteio && { dataSorteio: new Date(body.dataSorteio) }),
        ...(body.bolaoId && { bolaoId: body.bolaoId }),
        ...(body.quantNumeros !== undefined && { quantNumeros: Number(body.quantNumeros) }),
        ...(body.origem && { origem: body.origem }),
        ...(body.numeroConcurso !== undefined && { numeroConcurso: body.numeroConcurso || null }),
      },
    });

    return NextResponse.json(jogo);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 });
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
    await prisma.jogo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar jogo" }, { status: 500 });
  }
}
