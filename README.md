# Loja Virtual – Frontend (Next.js + Tailwind)

Frontend pronto para Vercel consumindo uma API REST configurável via `NEXT_PUBLIC_API_BASE`.

## 🧩 Requisitos
- Node 18+
- API rodando e acessível (por exemplo, a imagem Docker `gabirubr/lojavirtual` exposta em alguma URL).

## ⚙️ Configuração
Crie `.env.local` a partir do exemplo:
```
cp .env.local.example .env.local
```
Edite o valor da `NEXT_PUBLIC_API_BASE` (ex.: `https://api.minhadominio.com` ou `http://localhost:8000`).

## 🚀 Rodando localmente
```bash
npm i
npm run dev
```
Acesse http://localhost:3000

## 🧪 Estrutura
- **App Router** (Next.js 14)
- **Tailwind** para UI
- **lib/api.ts** centraliza as chamadas REST
- **SCHEMAS** em `lib/api.ts` mapeia colunas para tabelas/formulários

## 🧵 Recursos prontos
- Listagem, criação, edição e exclusão genérica para:
  - `/jogos`
  - `/generos`
  - `/atualizacoes`
  - `/empresas`
  - `/usuarios`

> Se sua API usar outros caminhos (ex.: `/api/v1/jogos`), ajuste `lib/api.ts`.

## ☁️ Deploy na Vercel
1. Crie um novo projeto apontando para este repositório.
2. Defina a variável **Environment Variable**:  
   - `NEXT_PUBLIC_API_BASE` → URL pública do seu backend.
3. Deploy.

## 🔐 CORS
Garanta que seu backend aceite requisições do domínio do Vercel (CORS).

## 🛠️ Personalização
- Ajuste os campos de cada recurso em `SCHEMAS` para refletir exatamente as chaves retornadas pela sua API.
- Substitua métodos `update`/`remove` por `PATCH`/rotas específicas, se necessário.

## 📄 Licença
MIT
