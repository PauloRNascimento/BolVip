import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [movimentacoes, boloesAtivos, boloesFinalizados, totalBoloes, totalResultados] =
      await Promise.all([
        prisma.movimentacao.findMany(),
        prisma.bolao.count({ where: { status: { not: "finalizado" } } }),
        prisma.bolao.count({ where: { status: "finalizado" } }),
        prisma.bolao.count(),
        prisma.resultado.count(),
      ]);

    const totalEntradas = movimentacoes
      .filter((m) => m.tipo === "entrada")
      .reduce((acc, m) => acc + m.valor, 0);

    const totalSaidas = movimentacoes
      .filter((m) => m.tipo === "saida")
      .reduce((acc, m) => acc + m.valor, 0);

    const saldo = totalEntradas - totalSaidas;

    const totalPremios = await prisma.resultado.aggregate({
      _sum: { valorGanho: true },
    });

    return NextResponse.json({
      saldo,
      totalEntradas,
      totalSaidas,
      boloesAtivos,
      boloesFinalizados,
      totalBoloes,
      totalResultados,
      totalPremiosGanhos: totalPremios._sum.valorGanho || 0,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar dashboard" }, { status: 500 });
  }
}
