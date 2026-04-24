import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participante = await prisma.participante.findUnique({
      where: { id },
      include: { bolao: true },
    });

    if (!participante) {
      return NextResponse.json({ error: "Participante não encontrado" }, { status: 404 });
    }

    return NextResponse.json(participante);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar participante" }, { status: 500 });
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

    const participante = await prisma.participante.update({
      where: { id },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.chavePix && { chavePix: body.chavePix }),
        ...(body.tipoPix && { tipoPix: body.tipoPix }),
        ...(body.cotas !== undefined && { cotas: Number(body.cotas) }),
        ...(body.bolaoId && { bolaoId: body.bolaoId }),
      },
    });

    return NextResponse.json(participante);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar participante" }, { status: 500 });
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
    await prisma.participante.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar participante" }, { status: 500 });
  }
}
