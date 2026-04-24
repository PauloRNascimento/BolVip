"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Movimentacao {
  id: string;
  tipo: string;
  valor: number;
  descricao: string;
  data: string;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(d));
}

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movimentacoes")
      .then((r) => r.json())
      .then((data) => { setMovimentacoes(data); setLoading(false); });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta movimentação?")) return;
    await fetch(`/api/movimentacoes/${id}`, { method: "DELETE" });
    setMovimentacoes((prev) => prev.filter((m) => m.id !== id));
  }

  const totalEntradas = movimentacoes.filter((m) => m.tipo === "entrada").reduce((acc, m) => acc + m.valor, 0);
  const totalSaidas = movimentacoes.filter((m) => m.tipo === "saida").reduce((acc, m) => acc + m.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <Link href="/admin/movimentacoes/novo" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors">
          + Nova Movimentação
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border bg-green-50 border-green-200 p-4 text-center">
          <p className="text-sm text-green-600">Entradas</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="rounded-xl border bg-red-50 border-red-200 p-4 text-center">
          <p className="text-sm text-red-600">Saídas</p>
          <p className="text-xl font-bold text-red-700">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 text-center">
          <p className="text-sm text-amber-600">Saldo</p>
          <p className="text-xl font-bold text-amber-700">{formatCurrency(saldo)}</p>
        </div>
      </div>

      {movimentacoes.length === 0 ? (
        <p className="text-gray-500">Nenhuma movimentação cadastrada.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Data</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Descrição</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Valor</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{formatDate(m.data)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      m.tipo === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {m.tipo === "entrada" ? "Entrada" : "Saída"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{m.descricao}</td>
                  <td className={`px-4 py-3 font-semibold ${m.tipo === "entrada" ? "text-green-700" : "text-red-700"}`}>
                    {m.tipo === "entrada" ? "+" : "-"}{formatCurrency(m.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/movimentacoes/${m.id}`} className="text-emerald-700 hover:text-emerald-900 text-xs font-medium">Editar</Link>
                      <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Excluir</button>
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
