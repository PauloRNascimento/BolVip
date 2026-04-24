# Bolao VIP

Sistema de gerenciamento de boloes de loteria com transparencia total.

## Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Estilo**: Tailwind CSS v4
- **Banco de Dados**: SQLite (Prisma ORM) - facilmente migravel para PostgreSQL
- **Autenticacao**: JWT (cookie httpOnly)
- **Linguagem**: TypeScript

## Funcionalidades

### Pagina Publica (Landing Page)
- Saldo atual e transparencia financeira
- Boloes ativos com detalhes (tipo, sorteio, valor da cota)
- Jogos realizados com numeros apostados
- Resultados e premiacoes
- Historico de boloes finalizados
- Botao flutuante de WhatsApp para participacao

### Painel Administrativo
- Dashboard com metricas financeiras
- CRUD completo de Boloes
- CRUD completo de Jogos
- CRUD completo de Resultados
- CRUD completo de Movimentacoes Financeiras
- Autenticacao com JWT

## Como Rodar

### Pre-requisitos
- Node.js 20+
- npm

### Instalacao

```bash
# Instalar dependencias
npm install

# Gerar o Prisma Client
npx prisma generate

# Criar o banco de dados e aplicar migracoes
npx prisma migrate dev

# Popular o banco com dados de exemplo
npx tsx prisma/seed.ts

# Iniciar o servidor de desenvolvimento
npm run dev
```

O site estara disponivel em [http://localhost:3000](http://localhost:3000).

### Acesso Admin

- **URL**: http://localhost:3000/admin/login
- **Email**: admin@bolaovip.com
- **Senha**: admin123

## Estrutura do Projeto

```
src/
  app/
    page.tsx              # Landing page publica
    layout.tsx            # Root layout
    api/
      auth/               # Login, logout, sessao
      boloes/             # CRUD boloes
      jogos/              # CRUD jogos
      resultados/         # CRUD resultados
      movimentacoes/      # CRUD financeiro
      dashboard/          # Stats publicos
    admin/
      page.tsx            # Dashboard admin
      login/              # Pagina de login
      boloes/             # Gerenciar boloes
      jogos/              # Gerenciar jogos
      resultados/         # Gerenciar resultados
      movimentacoes/      # Gerenciar financeiro
  components/
    Header.tsx            # Cabecalho publico
    Footer.tsx            # Rodape
    WhatsAppButton.tsx    # Botao flutuante WhatsApp
  lib/
    prisma.ts             # Cliente Prisma
    auth.ts               # Funcoes JWT
    utils.ts              # Utilitarios (formatacao, constantes)
prisma/
  schema.prisma           # Modelos do banco
  seed.ts                 # Dados de exemplo
```

## Modelos do Banco

- **User**: Administradores do sistema
- **Bolao**: Boloes de loteria (nome, tipo, sorteio, cotas, status)
- **Jogo**: Jogos/apostas realizadas (numeros, bolao relacionado)
- **Resultado**: Resultados dos sorteios (numeros sorteados, premio)
- **Movimentacao**: Controle financeiro (entradas e saidas)

## Configuracao WhatsApp

Edite o arquivo `src/lib/utils.ts` para configurar o numero do WhatsApp:

```typescript
export const WHATSAPP_NUMBER = "5511999999999"; // Seu numero
export const WHATSAPP_MESSAGE = "Ola! Quero participar do bolao!";
```

## Migrar para PostgreSQL

1. Altere o provider em `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

2. Configure a URL no `prisma.config.ts` e `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@localhost:5432/bolaovip"
   ```

3. Execute as migracoes:
   ```bash
   npx prisma migrate dev
   ```
