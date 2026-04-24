"use client";

import { useRouter } from "next/navigation";
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

export default function NovoParticipantePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [boloes, setBoloes] = useState<Bolao[]>([]);

  useEffect(() => {
    fetch("/api/boloes")
      .then((r) => r.json())
      .then(setBoloes);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      nome: formData.get("nome"),
      tipoPix: formData.get("tipoPix"),
      chavePix: formData.get("chavePix"),
      cotas: Number(formData.get("cotas")),
      bolaoId: formData.get("bolaoId"),
    };

    try {
      const res = await fetch("/api/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao cadastrar participante");
        return;
      }

      router.push("/admin/participantes");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Participante</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input name="nome" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Chave PIX</label>
          <select name="tipoPix" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
            {TIPOS_PIX.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
          <input name="chavePix" required placeholder="Celular, e-mail, CPF ou chave aleatória" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Cotas</label>
          <input name="cotas" type="number" min="1" defaultValue="1" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bolão</label>
          <select name="bolaoId" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
            <option value="">Selecione um bolão</option>
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
            {loading ? "Salvando..." : "Cadastrar Participante"}
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
