# 🎰 Bolão VIP

> Sistema completo de gerenciamento de bolões de loteria com **transparência total**. Uma vitrine pública para exibir jogos, resultados e movimentações financeiras, com painel administrativo para controle manual de tudo.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Acesso ao Painel Admin](#-acesso-ao-painel-admin)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Modelos do Banco de Dados](#-modelos-do-banco-de-dados)
- [API - Endpoints](#-api---endpoints)
- [Configuração do WhatsApp](#-configuração-do-whatsapp)
- [Personalização](#-personalização)
- [Migrar para PostgreSQL](#-migrar-para-postgresql)
- [Deploy em Produção](#-deploy-em-produção)
- [Melhorias Futuras](#-melhorias-futuras)

---

## 🎯 Sobre o Projeto

O **Bolão VIP** é um sistema web que permite:

- **Usuários visitantes** visualizarem informações sobre bolões de loteria com total transparência
- **Administrador** gerenciar tudo manualmente via painel seguro
- **Atrair participantes** para grupos de WhatsApp através de uma landing page profissional
- **Exibir transparência** dos jogos, resultados e saldos financeiros

### Princípios

- **Transparência visual = confiança = mais gente entrando**
- Mostra histórico real de jogos e prêmios
- Todas as movimentações financeiras são públicas
- _"Transparência total em cada jogo"_
- _"Todos os resultados publicados"_

### Regras Importantes

- ❌ NÃO integra com APIs reais de loteria (tudo manual)
- ❌ NÃO processa pagamentos (apenas exibição)
- ✅ Dados inseridos apenas pelo administrador
- ✅ Código limpo e bem estruturado

---

## ✨ Funcionalidades

### 🌐 Página Pública (Landing Page)

| Seção | Descrição |
|-------|-----------|
| **Hero** | Banner principal com CTA para WhatsApp e cards de métricas (saldo, prêmios, bolões ativos) |
| **Bolões Ativos** | Lista de bolões abertos/em andamento com tipo de jogo, data do sorteio, valor da cota e botão de participar |
| **Jogos Realizados** | Tabela com todos os jogos apostados, números em destaque e data do sorteio |
| **Resultados e Premiações** | Cards com resultados dos sorteios, números sorteados, valor ganho e quantidade de ganhadores |
| **Transparência Financeira** | Resumo financeiro com entradas, saídas e saldo atual + histórico de movimentações |
| **Histórico de Bolões** | Bolões finalizados para referência |
| **CTA Final** | Chamada para ação com botão de WhatsApp |

### 🔐 Painel Administrativo

| Funcionalidade | Descrição |
|----------------|-----------|
| **Login Seguro** | Autenticação com email/senha via JWT em cookie httpOnly |
| **Dashboard** | Visão geral com cards de métricas (saldo, entradas, saídas, prêmios, total de bolões) |
| **Gestão de Bolões** | Criar, editar, listar e excluir bolões com nome, tipo de jogo, data do sorteio, valor da cota, total de cotas e status |
| **Registro de Jogos** | Cadastrar números apostados vinculados a um bolão específico |
| **Resultados** | Registrar resultados dos sorteios com números sorteados, valor ganho e descrição |
| **Movimentações** | Controle financeiro com entradas (depósitos) e saídas (pagamentos/prêmios) |

### 📱 Integração WhatsApp

- Botão flutuante fixo em todas as páginas
- Botões de "Participar via WhatsApp" em cada bolão ativo
- Redirecionamento para WhatsApp com mensagem automática pré-definida
- Configuração centralizada do número e mensagem

---

## 🛠 Stack Tecnológica

| Tecnologia | Versão | Motivo |
|------------|--------|--------|
| **Next.js** | 16.x | Framework React full-stack com App Router, Server Components e API Routes |
| **React** | 19.x | Biblioteca de UI com Server/Client Components |
| **TypeScript** | 5.x | Tipagem estática para segurança e produtividade |
| **Tailwind CSS** | 4.x | Estilização utilitária com design responsivo mobile-first |
| **Prisma** | 7.x | ORM moderno com type-safety e migrations automáticas |
| **SQLite** | - | Banco leve para desenvolvimento (migrável para PostgreSQL) |
| **better-sqlite3** | - | Driver SQLite de alta performance para Prisma 7 |
| **bcryptjs** | - | Hash seguro de senhas |
| **jose** | - | Geração e verificação de tokens JWT |

---

## 📦 Pré-requisitos

- **Node.js** 20 ou superior
- **npm** 9 ou superior

> 💡 Recomendamos usar [nvm](https://github.com/nvm-sh/nvm) para gerenciar versões do Node.js

---

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/PauloRNascimento/BolVip.git
cd BolVip
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou edite o existente):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui-mude-em-producao"
```

> ⚠️ **Importante**: Em produção, use uma chave JWT forte e única!

### 4. Configurar o Banco de Dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar o banco e aplicar migrações
npx prisma migrate dev

# Popular com dados de exemplo (opcional)
npx tsx prisma/seed.ts
```

### 5. Rodar o Projeto

```bash
npm run dev
```

O site estará disponível em **http://localhost:3000**

---

## 🖥 Rodando o Projeto

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (com hot reload) |
| `npm run build` | Compila o projeto para produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o linter (ESLint) |
| `npx prisma studio` | Abre a interface visual do banco de dados |
| `npx prisma migrate dev` | Aplica novas migrações ao banco |
| `npx prisma generate` | Regenera o Prisma Client |
| `npx tsx prisma/seed.ts` | Popula o banco com dados de exemplo |

---

## 🔑 Acesso ao Painel Admin

Após rodar o seed, use as credenciais padrão:

| Campo | Valor |
|-------|-------|
| **URL** | http://localhost:3000/admin/login |
| **Email** | `admin@bolaovip.com` |
| **Senha** | `admin123` |

> ⚠️ **Importante**: Altere a senha do admin em produção!

### Navegação do Admin

- `/admin` — Dashboard com métricas
- `/admin/boloes` — Gerenciar bolões
- `/admin/boloes/novo` — Criar novo bolão
- `/admin/jogos` — Gerenciar jogos
- `/admin/jogos/novo` — Registrar novo jogo
- `/admin/resultados` — Gerenciar resultados
- `/admin/resultados/novo` — Registrar resultado
- `/admin/movimentacoes` — Gerenciar movimentações
- `/admin/movimentacoes/novo` — Nova movimentação

---

## 📁 Estrutura do Projeto

```
BolVip/
├── prisma/
│   ├── migrations/           # Migrações do banco de dados
│   ├── schema.prisma         # Definição dos modelos
│   └── seed.ts               # Script de dados de exemplo
├── prisma.config.ts          # Configuração do Prisma 7
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page pública
│   │   ├── layout.tsx        # Layout raiz (HTML, meta tags, fontes)
│   │   ├── globals.css       # Estilos globais + tema Tailwind
│   │   ├── admin/
│   │   │   ├── page.tsx      # Dashboard administrativo
│   │   │   ├── layout.tsx    # Layout do admin (sidebar + nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx  # Página de login
│   │   │   ├── boloes/
│   │   │   │   ├── page.tsx  # Listar bolões
│   │   │   │   ├── novo/     # Criar bolão
│   │   │   │   └── [id]/     # Editar bolão
│   │   │   ├── jogos/
│   │   │   │   ├── page.tsx  # Listar jogos
│   │   │   │   ├── novo/     # Registrar jogo
│   │   │   │   └── [id]/     # Editar jogo
│   │   │   ├── resultados/
│   │   │   │   ├── page.tsx  # Listar resultados
│   │   │   │   ├── novo/     # Registrar resultado
│   │   │   │   └── [id]/     # Editar resultado
│   │   │   └── movimentacoes/
│   │   │       ├── page.tsx  # Listar movimentações
│   │   │       ├── novo/     # Nova movimentação
│   │   │       └── [id]/     # Editar movimentação
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/    # POST - Autenticação
│   │       │   ├── logout/   # POST - Encerrar sessão
│   │       │   └── me/       # GET  - Dados do usuário logado
│   │       ├── boloes/       # GET, POST, PUT, DELETE
│   │       ├── jogos/        # GET, POST, PUT, DELETE
│   │       ├── resultados/   # GET, POST, PUT, DELETE
│   │       ├── movimentacoes/# GET, POST, PUT, DELETE
│   │       └── dashboard/    # GET - Estatísticas públicas
│   ├── components/
│   │   ├── Header.tsx        # Cabeçalho com navegação
│   │   ├── Footer.tsx        # Rodapé com links
│   │   └── WhatsAppButton.tsx# Botão flutuante de WhatsApp
│   └── lib/
│       ├── prisma.ts         # Instância singleton do Prisma Client
│       ├── auth.ts           # Funções JWT (sign, verify, session)
│       └── utils.ts          # Utilitários (formatação, constantes)
├── .env                      # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🗄 Modelos do Banco de Dados

### User (Administradores)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| email | String (unique) | Email de login |
| password | String | Senha hasheada (bcrypt) |
| name | String | Nome do administrador |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |

### Bolao (Bolões de Loteria)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| nome | String | Nome do bolão |
| tipoJogo | String | Tipo (Mega-Sena, Lotofácil, Quina, etc.) |
| dataSorteio | DateTime | Data do sorteio |
| valorCota | Float | Valor de cada cota |
| totalCotas | Int | Total de cotas disponíveis |
| status | String | "aberto", "em_andamento" ou "finalizado" |
| jogos | Jogo[] | Jogos vinculados |
| resultados | Resultado[] | Resultados vinculados |

### Jogo (Apostas Realizadas)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| numeros | String | Números apostados (ex: "04, 15, 23, 35, 42, 58") |
| dataSorteio | DateTime | Data do sorteio |
| bolaoId | String (FK) | Bolão relacionado |

### Resultado (Resultados dos Sorteios)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| numerosSorteados | String | Números que saíram no sorteio |
| valorGanho | Float | Valor do prêmio |
| quantGanhadores | Int | Quantidade de ganhadores |
| descricao | String? | Descrição do resultado |
| bolaoId | String (FK) | Bolão relacionado |

### Movimentacao (Controle Financeiro)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| tipo | String | "entrada" ou "saida" |
| valor | Float | Valor da movimentação |
| descricao | String | Descrição |
| data | DateTime | Data da movimentação |

---

## 🔌 API - Endpoints

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login (retorna cookie JWT) | Não |
| POST | `/api/auth/logout` | Logout (limpa cookie) | Sim |
| GET | `/api/auth/me` | Dados do usuário logado | Sim |

### Bolões

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/boloes` | Listar todos os bolões | Não |
| POST | `/api/boloes` | Criar novo bolão | Sim |
| GET | `/api/boloes/:id` | Detalhes de um bolão | Não |
| PUT | `/api/boloes/:id` | Atualizar bolão | Sim |
| DELETE | `/api/boloes/:id` | Excluir bolão | Sim |

### Jogos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/jogos` | Listar todos os jogos | Não |
| POST | `/api/jogos` | Registrar novo jogo | Sim |
| GET | `/api/jogos/:id` | Detalhes de um jogo | Não |
| PUT | `/api/jogos/:id` | Atualizar jogo | Sim |
| DELETE | `/api/jogos/:id` | Excluir jogo | Sim |

### Resultados

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/resultados` | Listar todos os resultados | Não |
| POST | `/api/resultados` | Registrar resultado | Sim |
| GET | `/api/resultados/:id` | Detalhes de um resultado | Não |
| PUT | `/api/resultados/:id` | Atualizar resultado | Sim |
| DELETE | `/api/resultados/:id` | Excluir resultado | Sim |

### Movimentações

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/movimentacoes` | Listar movimentações | Não |
| POST | `/api/movimentacoes` | Nova movimentação | Sim |
| GET | `/api/movimentacoes/:id` | Detalhes de uma movimentação | Não |
| PUT | `/api/movimentacoes/:id` | Atualizar movimentação | Sim |
| DELETE | `/api/movimentacoes/:id` | Excluir movimentação | Sim |

### Dashboard

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/dashboard` | Estatísticas públicas (saldo, totais, prêmios) | Não |

---

## 📱 Configuração do WhatsApp

Edite o arquivo `src/lib/utils.ts` para configurar o número e a mensagem:

```typescript
// Número do WhatsApp (com código do país + DDD)
export const WHATSAPP_NUMBER = "5511999999999";

// Mensagem automática enviada ao clicar no botão
export const WHATSAPP_MESSAGE = "Quero participar do bolão";
```

O botão gera automaticamente o link: `https://wa.me/5511999999999?text=Olá!%20Quero%20participar%20do%20bolão`

---

## 🎨 Personalização

### Cores do Tema

O tema é definido em `src/app/globals.css` usando Tailwind CSS v4:

- **Verde (emerald)**: Cor principal — transmite confiança, dinheiro e sorte
- **Dourado/Âmbar**: Cor de destaque — remete a prêmios e exclusividade
- **Fundo escuro (gray-900/950)**: Seções alternadas para contraste

### Tipos de Jogo Suportados

Definidos em `src/lib/utils.ts`:

- Mega-Sena
- Lotofácil
- Quina
- Lotomania
- Timemania
- Dupla-Sena
- Dia de Sorte

> Para adicionar novos tipos, edite o array `TIPOS_JOGO` no arquivo `src/lib/utils.ts`

---

## 🐘 Migrar para PostgreSQL

### 1. Instalar o adapter do PostgreSQL

```bash
npm install @prisma/adapter-pg pg
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3
```

### 2. Alterar o provider no schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
}
```

### 3. Configurar a URL de conexão

```env
# .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bolaovip"
```

Atualize também o `prisma.config.ts` se necessário.

### 4. Atualizar o Prisma Client (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}
```

### 5. Rodar as migrações

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts  # Se quiser dados de exemplo
```

---

## 🚀 Deploy em Produção

### Variáveis de Ambiente Necessárias

```env
DATABASE_URL="sua-url-do-banco"
JWT_SECRET="chave-secreta-forte-e-unica"
NODE_ENV="production"
```

### Opções de Deploy

| Plataforma | Tipo | Observação |
|------------|------|------------|
| **Vercel** | Serverless | Ideal para Next.js, precisa de banco externo (ex: Neon, Supabase) |
| **Railway** | Container | Suporta SQLite e PostgreSQL nativamente |
| **Render** | Container | Free tier disponível |
| **VPS (DigitalOcean, etc.)** | Servidor | Controle total, suporta SQLite local |

### Build de Produção

```bash
npx prisma generate
npm run build
npm run start
```

---

## 🔮 Melhorias Futuras

- [ ] Automação de resultados via web scraping
- [ ] Notificações por WhatsApp/Telegram
- [ ] Sistema de cotas com rastreio de participantes
- [ ] Relatórios financeiros em PDF
- [ ] App mobile (React Native)
- [ ] Dashboard com gráficos (Chart.js / Recharts)
- [ ] Modo escuro (dark mode)
- [ ] Multi-idioma (i18n)
- [ ] Sistema de convites e indicações
- [ ] Integração com PIX para exibição de QR Code

---

## 📄 Licença

Este projeto é de uso privado. Todos os direitos reservados.

---

**Desenvolvido com 💚 para o Bolão VIP**
