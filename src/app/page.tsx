import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusLabel, getStatusColor, getWhatsAppLink, MEGA_SENA_PRECOS } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [movimentacoes, boloes, jogos, allJogos, resultados] = await Promise.all([
    prisma.movimentacao.findMany(),
    prisma.bolao.findMany({
      include: { _count: { select: { jogos: true, participantes: true } } },
      orderBy: { dataSorteio: "desc" },
    }),
    prisma.jogo.findMany({
      include: { bolao: { select: { nome: true, tipoJogo: true } } },
      orderBy: { dataSorteio: "desc" },
      take: 10,
    }),
    prisma.jogo.findMany({ select: { quantNumeros: true, origem: true } }),
    prisma.resultado.findMany({
      include: { bolao: { select: { nome: true, tipoJogo: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalEntradas = movimentacoes
    .filter((m) => m.tipo === "entrada")
    .reduce((acc, m) => acc + m.valor, 0);
  const totalSaidas = movimentacoes
    .filter((m) => m.tipo === "saida")
    .reduce((acc, m) => acc + m.valor, 0);
  const saldo = totalEntradas - totalSaidas;
  const totalPremios = resultados.reduce((acc, r) => acc + r.valorGanho, 0);

  const boloesAtivos = boloes.filter((b) => b.status !== "finalizado");
  const boloesFinalizados = boloes.filter((b) => b.status === "finalizado");

  const totalJogos = allJogos.length;
  const jogosOnline = allJogos.filter((j) => j.origem === "online").length;
  const jogosFisicos = allJogos.filter((j) => j.origem === "fisica").length;
  const custoTotalJogos = allJogos.reduce((acc, j) => acc + (MEGA_SENA_PRECOS[j.quantNumeros] || 0), 0);

  return {
    saldo, totalPremios, boloesAtivos, boloesFinalizados,
    jogos, resultados, totalEntradas, totalSaidas,
    totalJogos, jogosOnline, jogosFisicos, custoTotalJogos,
  };
}

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%20width%3D%2280%22%20height%3D%2280%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%222%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Seu Bolão de Loteria com{" "}
                <span className="text-amber-400">Transparência Total</span>
              </h1>
              <p className="mt-6 text-lg text-emerald-100 max-w-2xl mx-auto">
                Participe dos melhores bolões de Mega-Sena, Lotofácil, Quina e mais.
                Todos os jogos e resultados publicados para você acompanhar!
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-400 hover:shadow-xl hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Quero Participar!
                </a>
                <a
                  href="#boloes"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                >
                  Ver Bolões Ativos
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 text-center">
                <p className="text-sm font-medium text-emerald-200">Saldo Atual</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">
                  {formatCurrency(data.saldo)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 text-center">
                <p className="text-sm font-medium text-emerald-200">Total em Prêmios</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">
                  {formatCurrency(data.totalPremios)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 text-center">
                <p className="text-sm font-medium text-emerald-200">Bolões Ativos</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {data.boloesAtivos.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 text-center">
                <p className="text-sm font-medium text-emerald-200">Bolões Realizados</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {data.boloesAtivos.length + data.boloesFinalizados.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bolões Ativos */}
        <section id="boloes" className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Bolões Ativos</h2>
              <p className="mt-2 text-gray-600">Confira os bolões disponíveis para participação</p>
            </div>
            {data.boloesAtivos.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum bolão ativo no momento.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.boloesAtivos.map((bolao) => (
                  <div
                    key={bolao.id}
                    className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        {bolao.tipoJogo}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(bolao.status)}`}>
                        {getStatusLabel(bolao.status)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{bolao.nome}</h3>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Sorteio:</span>
                        <span className="font-medium">{formatDate(bolao.dataSorteio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor da Cota:</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(bolao.valorCota)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Cotas:</span>
                        <span className="font-medium">{bolao.totalCotas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jogos Registrados:</span>
                        <span className="font-medium">{bolao._count.jogos}</span>
                      </div>
                    </div>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block text-center rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600"
                    >
                      Participar via WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Jogos Realizados */}
        <section id="jogos" className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Jogos Realizados</h2>
              <p className="mt-2 text-gray-600">Todos os jogos apostados com total transparência</p>
            </div>
            {data.jogos.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum jogo registrado ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Bolão</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Tipo</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Números</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Data Sorteio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.jogos.map((jogo) => (
                      <tr key={jogo.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {jogo.bolao.nome}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                            {jogo.bolao.tipoJogo}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {jogo.numeros.split(",").map((num, i) => (
                              <span
                                key={i}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800"
                              >
                                {num.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(jogo.dataSorteio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Arrecadação vs Jogos */}
        <section id="arrecadacao" className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Arrecadação vs Jogos</h2>
              <p className="mt-2 text-gray-600">Acompanhe quanto foi arrecadado e quanto foi investido em jogos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl bg-white p-6 text-center border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-emerald-600">Total Arrecadado</p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">{formatCurrency(data.totalEntradas)}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 text-center border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Custo dos Jogos</p>
                <p className="mt-2 text-2xl font-bold text-blue-700">{formatCurrency(data.custoTotalJogos)}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 text-center border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Total de Jogos</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{data.totalJogos}</p>
                <p className="mt-1 text-xs text-gray-500">{data.jogosOnline} online | {data.jogosFisicos} físicos</p>
              </div>
              <div className="rounded-2xl bg-white p-6 text-center border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-amber-600">Saldo Restante</p>
                <p className="mt-2 text-2xl font-bold text-amber-700">{formatCurrency(data.totalEntradas - data.custoTotalJogos)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section id="resultados" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Resultados e Premiações</h2>
              <p className="mt-2 text-gray-600">Confira nosso histórico de prêmios</p>
            </div>
            {data.resultados.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum resultado registrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {data.resultados.map((resultado) => (
                  <div
                    key={resultado.id}
                    className="rounded-2xl bg-white p-6 shadow-md border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{resultado.bolao.nome}</h3>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        {resultado.bolao.tipoJogo}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Números Sorteados:</p>
                      <div className="flex flex-wrap gap-1">
                        {resultado.numerosSorteados.split(",").map((num, i) => (
                          <span
                            key={i}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800"
                          >
                            {num.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    {resultado.valorGanho > 0 && (
                      <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700">Prêmio:</span>
                          <span className="text-lg font-bold text-green-700">
                            {formatCurrency(resultado.valorGanho)}
                          </span>
                        </div>
                        {resultado.quantGanhadores > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            {resultado.quantGanhadores} ganhador(es)
                          </p>
                        )}
                      </div>
                    )}
                    {resultado.descricao && (
                      <p className="mt-3 text-sm text-gray-600">{resultado.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Transparência Financeira */}
        <section id="transparencia" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Transparência Financeira</h2>
              <p className="mt-2 text-gray-600">
                Acompanhe todas as movimentações do nosso caixa
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
              <div className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200">
                <p className="text-sm font-medium text-emerald-600">Total de Entradas</p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">
                  {formatCurrency(data.totalEntradas)}
                </p>
              </div>
              <div className="rounded-2xl bg-red-50 p-6 text-center border border-red-200">
                <p className="text-sm font-medium text-red-600">Total de Saídas</p>
                <p className="mt-2 text-2xl font-bold text-red-700">
                  {formatCurrency(data.totalSaidas)}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-6 text-center border border-amber-200">
                <p className="text-sm font-medium text-amber-600">Saldo Atual</p>
                <p className="mt-2 text-2xl font-bold text-amber-700">
                  {formatCurrency(data.saldo)}
                </p>
              </div>
            </div>
            <div className="text-center bg-emerald-700 rounded-2xl p-8 text-white">
              <p className="text-lg font-semibold">Já pagamos em prêmios:</p>
              <p className="mt-2 text-4xl font-extrabold text-amber-400">
                {formatCurrency(data.totalPremios)}
              </p>
              <p className="mt-4 text-emerald-200 text-sm">
                Transparência total em cada jogo. Todos os resultados publicados.
              </p>
            </div>
          </div>
        </section>

        {/* Bolões Finalizados */}
        {data.boloesFinalizados.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Histórico de Bolões</h2>
                <p className="mt-2 text-gray-600">Bolões já finalizados</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.boloesFinalizados.map((bolao) => (
                  <div
                    key={bolao.id}
                    className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 opacity-80"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {bolao.tipoJogo}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        Finalizado
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">{bolao.nome}</h3>
                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Sorteio:</span>
                        <span>{formatDate(bolao.dataSorteio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor da Cota:</span>
                        <span>{formatCurrency(bolao.valorCota)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Cotas:</span>
                        <span>{bolao.totalCotas}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Pronto para Participar?</h2>
            <p className="mt-4 text-lg text-emerald-100">
              Entre em contato pelo WhatsApp e comece a participar dos nossos bolões agora mesmo!
            </p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-400 hover:shadow-xl hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Participar pelo WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
