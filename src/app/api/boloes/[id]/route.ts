import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bolao = await prisma.bolao.findUnique({
      where: { id },
      include: { jogos: true, resultados: true },
    });

    if (!bolao) {
      return NextResponse.json({ error: "Bolão não encontrado" }, { status: 404 });
    }

    return NextResponse.json(bolao);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar bolão" }, { status: 500 });
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

    const bolao = await prisma.bolao.update({
      where: { id },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.tipoJogo && { tipoJogo: body.tipoJogo }),
        ...(body.dataSorteio && { dataSorteio: new Date(body.dataSorteio) }),
        ...(body.valorCota !== undefined && { valorCota: Number(body.valorCota) }),
        ...(body.totalCotas !== undefined && { totalCotas: Number(body.totalCotas) }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json(bolao);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar bolão" }, { status: 500 });
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
    await prisma.bolao.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar bolão" }, { status: 500 });
  }
}
