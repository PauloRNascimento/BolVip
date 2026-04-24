"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Jogo {
  id: string;
  numeros: string;
  dataSorteio: string;
  bolaoId: string;
}

interface Bolao {
  id: string;
  nome: string;
  tipoJogo: string;
}

export default function EditJogoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/jogos/${id}`).then((r) => r.json()),
      fetch("/api/boloes").then((r) => r.json()),
    ]).then(([jogoData, boloesData]) => {
      setJogo(jogoData);
      setBoloes(boloesData);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      numeros: formData.get("numeros"),
      dataSorteio: formData.get("dataSorteio"),
      bolaoId: formData.get("bolaoId"),
    };

    try {
      const res = await fetch(`/api/jogos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar");
        return;
      }

      router.push("/admin/jogos");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  if (!jogo) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;

  const dataSorteio = new Date(jogo.dataSorteio).toISOString().split("T")[0];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Jogo</h1>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border space-y-4">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

        <div>
          <label htmlFor="bolaoId" className="block text-sm font-medium text-gray-700 mb-1">Bolão</label>
          <select id="bolaoId" name="bolaoId" defaultValue={jogo.bolaoId} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none">
            {boloes.map((b) => <option key={b.id} value={b.id}>{b.nome} ({b.tipoJogo})</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="numeros" className="block text-sm font-medium text-gray-700 mb-1">Números</label>
          <input id="numeros" name="numeros" defaultValue={jogo.numeros} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="dataSorteio" className="block text-sm font-medium text-gray-700 mb-1">Data do Sorteio</label>
          <input id="dataSorteio" name="dataSorteio" type="date" defaultValue={dataSorteio} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
