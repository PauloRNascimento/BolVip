import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { jogos, bolaoId, numeroConcurso, origem } = body;

    if (!jogos || !Array.isArray(jogos) || jogos.length === 0 || !bolaoId) {
      return NextResponse.json({ error: "Dados inválidos para importação" }, { status: 400 });
    }

    const bolao = await prisma.bolao.findUnique({ where: { id: bolaoId } });
    if (!bolao) {
      return NextResponse.json({ error: "Bolão não encontrado" }, { status: 404 });
    }

    const created = await Promise.all(
      jogos.map((jogo: { numeros: string; quantNumeros?: number }) =>
        prisma.jogo.create({
          data: {
            numeros: jogo.numeros,
            dataSorteio: bolao.dataSorteio,
            bolaoId,
            quantNumeros: jogo.quantNumeros || jogo.numeros.split(",").length,
            origem: origem || "online",
            numeroConcurso: numeroConcurso || null,
          },
        })
      )
    );

    return NextResponse.json({ imported: created.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao importar jogos" }, { status: 500 });
  }
}
