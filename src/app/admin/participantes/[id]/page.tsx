"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Bolao {
  id: string;
  nome: string;
}

const TIPOS_PIX = [
  { value: "celular", label: "Celular" },
  { value: "email", label: "E-mail" },
  { value: "cpf", label: "CPF" },
  { value: "aleatoria", label: "Chave Aleatória" },
];

export default function EditarParticipantePage() {
  const { id } = useParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [formData, setFormData] = useState({
    nome: "",
    tipoPix: "celular",
    chavePix: "",
    cotas: 1,
    bolaoId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/participantes/${id}`).then((r) => r.json()),
      fetch("/api/boloes").then((r) => r.json()),
    ]).then(([participante, boloesData]) => {
      setFormData({
        nome: participante.nome,
        tipoPix: participante.tipoPix,
        chavePix: participante.chavePix,
        cotas: participante.cotas,
        bolaoId: participante.bolaoId,
      });
      setBoloes(boloesData);
      setLoadingData(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/participantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar participante");
        return;
      }

      router.push("/admin/participantes");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Carregando...</p></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Participante</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Chave PIX</label>
          <select value={formData.tipoPix} onChange={(e) => setFormData({ ...formData, tipoPix: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
            {TIPOS_PIX.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
          <input value={formData.chavePix} onChange={(e) => setFormData({ ...formData, chavePix: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Cotas</label>
          <input type="number" min="1" value={formData.cotas} onChange={(e) => setFormData({ ...formData, cotas: Number(e.target.value) })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bolão</label>
          <select value={formData.bolaoId} onChange={(e) => setFormData({ ...formData, bolaoId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
            {boloes.map((b) => (
              <option key={b.id} value={b.id}>{b.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/participantes")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
