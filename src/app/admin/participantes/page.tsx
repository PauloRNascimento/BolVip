"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Participante {
  id: string;
  nome: string;
  chavePix: string;
  tipoPix: string;
  cotas: number;
  bolao: { nome: string; tipoJogo: string };
}

const tipoPixLabels: Record<string, string> = {
  celular: "Celular",
  email: "E-mail",
  cpf: "CPF",
  aleatoria: "Chave Aleatória",
};

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/participantes")
      .then((r) => r.json())
      .then((data) => {
        setParticipantes(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este participante?")) return;
    await fetch(`/api/participantes/${id}`, { method: "DELETE" });
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
        <Link
          href="/admin/participantes/novo"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          + Novo Participante
        </Link>
      </div>

      {participantes.length === 0 ? (
        <p className="text-gray-500">Nenhum participante cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Nome</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tipo PIX</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Chave PIX</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Cotas</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Bolão</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{tipoPixLabels[p.tipoPix] || p.tipoPix}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.chavePix}</td>
                  <td className="px-4 py-3 text-gray-600">{p.cotas}</td>
                  <td className="px-4 py-3 text-gray-600">{p.bolao.nome}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/participantes/${p.id}`}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
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
