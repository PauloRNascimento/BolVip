import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashSync } from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@bolaovip.com" },
    update: {},
    create: {
      email: "admin@bolaovip.com",
      password: hashSync("admin123", 10),
      name: "Administrador",
    },
  });
  console.log("Admin criado:", admin.email);

  const bolao1 = await prisma.bolao.create({
    data: {
      nome: "Mega da Virada 2026",
      tipoJogo: "Mega-Sena",
      dataSorteio: new Date("2026-12-31"),
      valorCota: 25.0,
      totalCotas: 100,
      status: "aberto",
    },
  });

  const bolao2 = await prisma.bolao.create({
    data: {
      nome: "Lotofácil Semanal",
      tipoJogo: "Lotofácil",
      dataSorteio: new Date("2026-05-01"),
      valorCota: 10.0,
      totalCotas: 50,
      status: "em_andamento",
    },
  });

  const bolao3 = await prisma.bolao.create({
    data: {
      nome: "Quina Especial",
      tipoJogo: "Quina",
      dataSorteio: new Date("2026-03-15"),
      valorCota: 15.0,
      totalCotas: 40,
      status: "finalizado",
    },
  });

  await prisma.jogo.createMany({
    data: [
      {
        numeros: "04, 15, 23, 35, 42, 58",
        dataSorteio: new Date("2026-12-31"),
        bolaoId: bolao1.id,
      },
      {
        numeros: "07, 12, 28, 33, 47, 55",
        dataSorteio: new Date("2026-12-31"),
        bolaoId: bolao1.id,
      },
      {
        numeros: "01, 03, 05, 07, 09, 11, 13, 14, 16, 18, 19, 20, 22, 24, 25",
        dataSorteio: new Date("2026-05-01"),
        bolaoId: bolao2.id,
      },
      {
        numeros: "05, 18, 33, 47, 62",
        dataSorteio: new Date("2026-03-15"),
        bolaoId: bolao3.id,
      },
    ],
  });

  await prisma.resultado.create({
    data: {
      numerosSorteados: "05, 18, 33, 47, 62",
      valorGanho: 1500.0,
      quantGanhadores: 3,
      descricao: "Acertamos a Quina! Prêmio dividido entre 3 cotas.",
      bolaoId: bolao3.id,
    },
  });

  await prisma.movimentacao.createMany({
    data: [
      {
        tipo: "entrada",
        valor: 2500.0,
        descricao: "Depósitos das cotas - Mega da Virada",
        data: new Date("2026-01-15"),
      },
      {
        tipo: "entrada",
        valor: 500.0,
        descricao: "Depósitos das cotas - Lotofácil Semanal",
        data: new Date("2026-02-01"),
      },
      {
        tipo: "entrada",
        valor: 1500.0,
        descricao: "Prêmio Quina Especial",
        data: new Date("2026-03-16"),
      },
      {
        tipo: "saida",
        valor: 600.0,
        descricao: "Pagamento de apostas - Mega da Virada",
        data: new Date("2026-01-20"),
      },
      {
        tipo: "saida",
        valor: 1500.0,
        descricao: "Pagamento prêmio - Quina Especial",
        data: new Date("2026-03-17"),
      },
    ],
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
