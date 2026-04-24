"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Bolao {
  id: string;
  nome: string;
  tipoJogo: string;
}

export default function NovoJogoPage() {
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
      numeros: formData.get("numeros"),
      dataSorteio: formData.get("dataSorteio"),
      bolaoId: formData.get("bolaoId"),
    };

    try {
      const res = await fetch("/api/jogos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar jogo");
        return;
      }

      router.push("/admin/jogos");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Jogo</h1>

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
          <label htmlFor="numeros" className="block text-sm font-medium text-gray-700 mb-1">Números (separados por vírgula)</label>
          <input id="numeros" name="numeros" placeholder="04, 15, 23, 35, 42, 58" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="dataSorteio" className="block text-sm font-medium text-gray-700 mb-1">Data do Sorteio</label>
          <input id="dataSorteio" name="dataSorteio" type="date" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors">
            {loading ? "Salvando..." : "Criar Jogo"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
