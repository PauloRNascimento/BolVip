"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Bolao { id: string; nome: string; tipoJogo: string; }

export default function NovoResultadoPage() {
  const router = useRouter();
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/boloes").then((r) => r.json()).then(setBoloes);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      numerosSorteados: formData.get("numerosSorteados"),
      valorGanho: Number(formData.get("valorGanho")),
      quantGanhadores: Number(formData.get("quantGanhadores")),
      descricao: formData.get("descricao") || null,
      bolaoId: formData.get("bolaoId"),
    };

    try {
      const res = await fetch("/api/resultados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar resultado");
        return;
      }

      router.push("/admin/resultados");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Resultado</h1>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border space-y-4">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

        <div>
          <label htmlFor="bolaoId" className="block text-sm font-medium text-gray-700 mb-1">Bolão</label>
          <select id="bolaoId" name="bolaoId" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none">
            <option value="">Selecione...</option>
            {boloes.map((b) => <option key={b.id} value={b.id}>{b.nome} ({b.tipoJogo})</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="numerosSorteados" className="block text-sm font-medium text-gray-700 mb-1">Números Sorteados</label>
          <input id="numerosSorteados" name="numerosSorteados" placeholder="05, 18, 33, 47, 62" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="valorGanho" className="block text-sm font-medium text-gray-700 mb-1">Valor Ganho (R$)</label>
            <input id="valorGanho" name="valorGanho" type="number" step="0.01" min="0" defaultValue="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="quantGanhadores" className="block text-sm font-medium text-gray-700 mb-1">Ganhadores</label>
            <input id="quantGanhadores" name="quantGanhadores" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
          <textarea id="descricao" name="descricao" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors">
            {loading ? "Salvando..." : "Criar Resultado"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
