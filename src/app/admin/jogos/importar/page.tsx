"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MEGA_SENA_PRECOS, formatCurrency } from "@/lib/utils";

interface Bolao {
  id: string;
  nome: string;
  tipoJogo: string;
}

export default function ImportarJogosPage() {
  const router = useRouter();
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jogosText, setJogosText] = useState("");
  const [origem, setOrigem] = useState("online");
  const [numeroConcurso, setNumeroConcurso] = useState("");
  const [bolaoId, setBolaoId] = useState("");

  useEffect(() => {
    fetch("/api/boloes").then((r) => r.json()).then(setBoloes);
  }, []);

  function parseJogos(text: string) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const nums = line.split(/[,;\s]+/).filter(Boolean);
        return { numeros: nums.join(", "), quantNumeros: nums.length };
      });
  }

  const parsedJogos = parseJogos(jogosText);
  const totalCusto = parsedJogos.reduce((acc, j) => {
    return acc + (MEGA_SENA_PRECOS[j.quantNumeros] || 0);
  }, 0);

  async function handleImport() {
    if (!bolaoId) { setError("Selecione um bolão"); return; }
    if (parsedJogos.length === 0) { setError("Adicione pelo menos um jogo"); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/jogos/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jogos: parsedJogos,
          bolaoId,
          numeroConcurso: numeroConcurso || null,
          origem,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao importar");
        return;
      }

      const data = await res.json();
      setSuccess(`${data.imported} jogo(s) importado(s) com sucesso!`);
      setJogosText("");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Importar Jogos</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm border space-y-4">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
        {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bolão</label>
            <select value={bolaoId} onChange={(e) => setBolaoId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
              <option value="">Selecione...</option>
              {boloes.map((b) => <option key={b.id} value={b.id}>{b.nome} ({b.tipoJogo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concurso</label>
            <input value={numeroConcurso} onChange={(e) => setNumeroConcurso(e.target.value)} placeholder="Ex: 2800" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
            <select value={origem} onChange={(e) => setOrigem(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
              <option value="online">Online</option>
              <option value="fisica">Lotérica (Físico)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jogos (um jogo por linha, números separados por vírgula ou espaço)
          </label>
          <textarea
            value={jogosText}
            onChange={(e) => setJogosText(e.target.value)}
            rows={10}
            placeholder={"04, 15, 23, 35, 42, 58\n01, 08, 12, 25, 33, 47, 52, 59, 60\n03, 11, 19, 28, 37, 44"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        {parsedJogos.length > 0 && (
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumo da Importação</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Total de Jogos:</span>
                <p className="font-bold text-gray-900">{parsedJogos.length}</p>
              </div>
              <div>
                <span className="text-gray-500">Online:</span>
                <p className="font-bold text-gray-900">{origem === "online" ? parsedJogos.length : 0}</p>
              </div>
              <div>
                <span className="text-gray-500">Físico:</span>
                <p className="font-bold text-gray-900">{origem === "fisica" ? parsedJogos.length : 0}</p>
              </div>
              <div>
                <span className="text-gray-500">Custo Total:</span>
                <p className="font-bold text-emerald-700">{formatCurrency(totalCusto)}</p>
              </div>
            </div>
            <div className="mt-3 max-h-40 overflow-y-auto">
              {parsedJogos.map((j, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
                  <span className="text-gray-400 w-6">#{i + 1}</span>
                  <span className="font-mono">{j.numeros}</span>
                  <span className="text-gray-400">({j.quantNumeros} números = {formatCurrency(MEGA_SENA_PRECOS[j.quantNumeros] || 0)})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabela de Preços */}
        <details className="rounded-lg border border-gray-200 p-3">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">Tabela de Preços Mega-Sena</summary>
          <div className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(MEGA_SENA_PRECOS).map(([nums, preco]) => (
              <div key={nums} className="text-center rounded-lg bg-gray-50 p-2 text-xs">
                <span className="font-bold text-emerald-700">{nums} nº</span>
                <p className="text-gray-600">{formatCurrency(preco)}</p>
              </div>
            ))}
          </div>
        </details>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleImport}
            disabled={loading || parsedJogos.length === 0}
            className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Importando..." : `Importar ${parsedJogos.length} Jogo(s)`}
          </button>
          <button onClick={() => router.push("/admin/jogos")} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
