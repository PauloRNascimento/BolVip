"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatCurrency, MEGA_SENA_PRECOS, COMISSAO_OPERADOR } from "@/lib/utils";
import { useState } from "react";

export default function CalculadoraPage() {
  const [premio, setPremio] = useState(100000000);
  const [totalCotas, setTotalCotas] = useState(863);
  const [minhasCotas, setMinhasCotas] = useState(1);

  const comissaoOperador = premio * COMISSAO_OPERADOR;
  const premioLiquido = premio - comissaoOperador;
  const valorPorCota = totalCotas > 0 ? premioLiquido / totalCotas : 0;
  const meuPremio = valorPorCota * minhasCotas;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Calculadora de Prêmios
            </h1>
            <p className="mt-4 text-emerald-200">
              Simule quanto você pode ganhar com base nas suas cotas
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Simulação de Prêmio</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor do Prêmio (R$)
                  </label>
                  <input
                    type="number"
                    value={premio}
                    onChange={(e) => setPremio(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total de Cotas do Concurso
                  </label>
                  <input
                    type="number"
                    value={totalCotas}
                    onChange={(e) => setTotalCotas(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minhas Cotas
                  </label>
                  <input
                    type="number"
                    value={minhasCotas}
                    onChange={(e) => setMinhasCotas(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Distribuição do Prêmio</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prêmio Total:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(premio)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Comissão Operador (10%):</span>
                      <span className="font-bold text-red-600">- {formatCurrency(comissaoOperador)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Prêmio Líquido:</span>
                      <span className="text-lg font-bold text-emerald-700">{formatCurrency(premioLiquido)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 p-5 border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-700 mb-3">Sua Estimativa</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-600">Valor por Cota:</span>
                      <span className="font-bold text-emerald-800">{formatCurrency(valorPorCota)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-600">Suas Cotas:</span>
                      <span className="font-bold text-emerald-800">{minhasCotas} de {totalCotas}</span>
                    </div>
                    <div className="border-t border-emerald-200 pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-emerald-700">Seu Prêmio Estimado:</span>
                      <span className="text-2xl font-extrabold text-emerald-700">{formatCurrency(meuPremio)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-5 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-700 mb-2">Como funciona?</h3>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>O operador do bolão recebe <strong>10%</strong> do prêmio total como comissão.</li>
                  <li>Os <strong>90%</strong> restantes são divididos proporcionalmente pelas cotas.</li>
                  <li>Quanto mais cotas você tiver, maior será sua participação no prêmio.</li>
                  <li>Cada cota tem o mesmo valor: prêmio líquido dividido pelo total de cotas.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela de Preços */}
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tabela de Preços Mega-Sena</h2>
              <p className="mt-2 text-gray-600">Valores por quantidade de números apostados</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(MEGA_SENA_PRECOS).map(([nums, preco]) => (
                <div
                  key={nums}
                  className={`rounded-xl p-4 text-center border shadow-sm ${
                    nums === "9" ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500" : "bg-white border-gray-200"
                  }`}
                >
                  <p className="text-2xl font-bold text-emerald-700">{nums}</p>
                  <p className="text-xs text-gray-500">números</p>
                  <p className="mt-2 text-sm font-bold text-gray-900">{formatCurrency(preco)}</p>
                  {nums === "9" && <p className="mt-1 text-xs text-emerald-600 font-semibold">Recomendado</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
