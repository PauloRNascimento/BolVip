"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Jogo {
  id: string;
  numeros: string;
  dataSorteio: string;
  quantNumeros: number;
  origem: string;
  numeroConcurso: string | null;
  bolao: { nome: string; tipoJogo: string };
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(d));
}

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jogos")
      .then((r) => r.json())
      .then((data) => { setJogos(data); setLoading(false); });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este jogo?")) return;
    await fetch(`/api/jogos/${id}`, { method: "DELETE" });
    setJogos((prev) => prev.filter((j) => j.id !== id));
  }

  const jogosOnline = jogos.filter((j) => j.origem === "online").length;
  const jogosFisicos = jogos.filter((j) => j.origem === "fisica").length;

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
        <div className="flex gap-2">
          <Link href="/admin/jogos/importar" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Importar Jogos
          </Link>
          <Link href="/admin/jogos/novo" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors">
            + Novo Jogo
          </Link>
        </div>
      </div>

      {jogos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-white p-4 border shadow-sm text-center">
            <p className="text-sm text-gray-500">Total de Jogos</p>
            <p className="text-2xl font-bold text-gray-900">{jogos.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border shadow-sm text-center">
            <p className="text-sm text-gray-500">Online</p>
            <p className="text-2xl font-bold text-blue-600">{jogosOnline}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border shadow-sm text-center">
            <p className="text-sm text-gray-500">Lotérica (Físico)</p>
            <p className="text-2xl font-bold text-amber-600">{jogosFisicos}</p>
          </div>
        </div>
      )}

      {jogos.length === 0 ? (
        <p className="text-gray-500">Nenhum jogo cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Bolão</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Concurso</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Origem</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Números</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Qtd</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Sorteio</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jogos.map((j) => (
                <tr key={j.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{j.bolao.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{j.numeroConcurso || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${j.origem === "online" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                      {j.origem === "online" ? "Online" : "Física"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {j.numeros.split(",").map((n, i) => (
                        <span key={i} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          {n.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{j.quantNumeros}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(j.dataSorteio)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/jogos/${j.id}`} className="text-emerald-700 hover:text-emerald-900 text-xs font-medium">Editar</Link>
                      <button onClick={() => handleDelete(j.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Excluir</button>
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
