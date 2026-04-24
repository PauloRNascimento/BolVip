"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Bolao {
  id: string;
  nome: string;
  tipoJogo: string;
  dataSorteio: string;
  valorCota: number;
  totalCotas: number;
  status: string;
  _count: { jogos: number; resultados: number };
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(d));
}

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  finalizado: "Finalizado",
};

const statusColors: Record<string, string> = {
  aberto: "bg-green-100 text-green-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  finalizado: "bg-gray-100 text-gray-800",
};

export default function BoloesPage() {
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/boloes")
      .then((r) => r.json())
      .then((data) => {
        setBoloes(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este bolão?")) return;
    await fetch(`/api/boloes/${id}`, { method: "DELETE" });
    setBoloes((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bolões</h1>
        <Link
          href="/admin/boloes/novo"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          + Novo Bolão
        </Link>
      </div>

      {boloes.length === 0 ? (
        <p className="text-gray-500">Nenhum bolão cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Nome</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Sorteio</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Cota</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Cotas</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {boloes.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{b.tipoJogo}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.dataSorteio)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(b.valorCota)}</td>
                  <td className="px-4 py-3 text-gray-600">{b.totalCotas}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[b.status] || "bg-gray-100"}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/boloes/${b.id}`}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Excluir
                      </button>
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
