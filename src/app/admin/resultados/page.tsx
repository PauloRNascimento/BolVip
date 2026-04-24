"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Resultado {
  id: string;
  numerosSorteados: string;
  valorGanho: number;
  quantGanhadores: number;
  descricao: string | null;
  bolao: { nome: string; tipoJogo: string };
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resultados")
      .then((r) => r.json())
      .then((data) => { setResultados(data); setLoading(false); });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este resultado?")) return;
    await fetch(`/api/resultados/${id}`, { method: "DELETE" });
    setResultados((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resultados</h1>
        <Link href="/admin/resultados/novo" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors">
          + Novo Resultado
        </Link>
      </div>

      {resultados.length === 0 ? (
        <p className="text-gray-500">Nenhum resultado cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Bolão</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Números Sorteados</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Prêmio</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ganhadores</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.bolao.nome}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.numerosSorteados.split(",").map((n, i) => (
                        <span key={i} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                          {n.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-green-700 font-semibold">{formatCurrency(r.valorGanho)}</td>
                  <td className="px-4 py-3 text-gray-600">{r.quantGanhadores}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/resultados/${r.id}`} className="text-emerald-700 hover:text-emerald-900 text-xs font-medium">Editar</Link>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
