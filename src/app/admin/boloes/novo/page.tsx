"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS_JOGO = ["Mega-Sena", "Lotofácil", "Quina", "Lotomania", "Dupla Sena", "Timemania", "Dia de Sorte"];

export default function NovoBolaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      nome: formData.get("nome"),
      tipoJogo: formData.get("tipoJogo"),
      dataSorteio: formData.get("dataSorteio"),
      valorCota: Number(formData.get("valorCota")),
      totalCotas: Number(formData.get("totalCotas")),
      status: formData.get("status"),
    };

    try {
      const res = await fetch("/api/boloes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar bolão");
        return;
      }

      router.push("/admin/boloes");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Bolão</h1>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
        )}

        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Bolão</label>
          <input id="nome" name="nome" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="tipoJogo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Jogo</label>
          <select id="tipoJogo" name="tipoJogo" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none">
            {TIPOS_JOGO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="dataSorteio" className="block text-sm font-medium text-gray-700 mb-1">Data do Sorteio</label>
          <input id="dataSorteio" name="dataSorteio" type="date" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="valorCota" className="block text-sm font-medium text-gray-700 mb-1">Valor da Cota (R$)</label>
            <input id="valorCota" name="valorCota" type="number" step="0.01" min="0" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="totalCotas" className="block text-sm font-medium text-gray-700 mb-1">Total de Cotas</label>
            <input id="totalCotas" name="totalCotas" type="number" min="1" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" name="status" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none">
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors">
            {loading ? "Salvando..." : "Criar Bolão"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
