"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  saldo: number;
  totalEntradas: number;
  totalSaidas: number;
  boloesAtivos: number;
  boloesFinalizados: number;
  totalBoloes: number;
  totalResultados: number;
  totalPremiosGanhos: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const stats = [
    { label: "Saldo Atual", value: formatCurrency(data.saldo), color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Total Entradas", value: formatCurrency(data.totalEntradas), color: "bg-green-50 text-green-700 border-green-200" },
    { label: "Total Saídas", value: formatCurrency(data.totalSaidas), color: "bg-red-50 text-red-700 border-red-200" },
    { label: "Prêmios Ganhos", value: formatCurrency(data.totalPremiosGanhos), color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Bolões Ativos", value: String(data.boloesAtivos), color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Total de Bolões", value: String(data.totalBoloes), color: "bg-purple-50 text-purple-700 border-purple-200" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-6 ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
