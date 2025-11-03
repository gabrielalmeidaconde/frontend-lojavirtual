# 🎮 GameStore - Loja Virtual de Jogos

Uma loja virtual moderna de jogos desenvolvida com React + Vite, integrada com backend Spring Boot.

## 🚀 Funcionalidades

- ✅ Navegação e busca de jogos
- ✅ Sistema de autenticação (Login/Registro)
- ✅ Compra direta de jogos
- ✅ Painel administrativo completo
- ✅ Gerenciamento de jogos, gêneros, empresas e atualizações
- ✅ Interface responsiva e moderna
- ✅ Integração completa com API REST

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server rápido
- **React Router DOM** - Navegação entre páginas
- **Axios** - Cliente HTTP para requisições à API
- **Context API** - Gerenciamento de estado global
- **CSS3** - Estilização moderna com gradientes e animações

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── Header.jsx     # Cabeçalho com navegação
│   └── GameCard.jsx   # Card para exibir jogos
├── pages/             # Páginas da aplicação
│   ├── Home.jsx       # Listagem de jogos
│   ├── Login.jsx      # Página de login
│   ├── Register.jsx   # Página de cadastro
│   ├── Orders.jsx     # Histórico de pedidos
│   └── Admin.jsx      # Painel administrativo
├── context/           # Contextos React
│   └── AuthContext.jsx    # Gerenciamento de autenticação
├── services/          # Serviços de API
│   └── api.js         # Configuração do Axios e endpoints
├── App.jsx            # Componente principal
└── main.jsx           # Ponto de entrada
```

## 🔌 Endpoints da API

O frontend se conecta aos seguintes endpoints do backend:

### 🎮 Jogos (`/jogos`)
- `GET /jogos` - Listar todos os jogos
- `GET /jogos/{id}` - Buscar jogo por ID
- `POST /jogos` - Criar novo jogo
- `PUT /jogos` - Atualizar jogo
- `DELETE /jogos/{id}` - Deletar jogo
- `POST /jogos/{id}/comprar` - Comprar um jogo

### 🎯 Gêneros (`/generos`)
- `GET /generos` - Listar todos os gêneros
- `GET /generos/{id}` - Buscar gênero por ID
- `POST /generos` - Criar novo gênero
- `PUT /generos` - Atualizar gênero
- `DELETE /generos/{id}` - Deletar gênero

### 🏢 Empresas (`/empresas`)
- `GET /empresas` - Listar todas as empresas
- `GET /empresas/{id}` - Buscar empresa por ID
- `POST /empresas` - Criar nova empresa
- `PUT /empresas` - Atualizar empresa
- `DELETE /empresas/{id}` - Deletar empresa

### 🔄 Atualizações (`/atualizacoes`)
- `GET /atualizacoes` - Listar todas as atualizações
- `GET /atualizacoes/{id}` - Buscar atualização por ID
- `POST /atualizacoes` - Criar nova atualização
- `PUT /atualizacoes` - Atualizar atualização
- `DELETE /atualizacoes/{id}` - Deletar atualização

### 👤 Usuários (`/usuarios`)
- `GET /usuarios` - Listar todos os usuários
- `POST /usuarios` - Cadastrar usuário
- `POST /usuarios/login` - Fazer login

## ⚙️ Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar URL da API:**
   
   Edite o arquivo `src/services/api.js` e ajuste a `baseURL` se necessário:
   ```javascript
   baseURL: 'http://localhost:8080'
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Build para produção:**
   ```bash
   npm run build
   ```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:
- O token é armazenado no `localStorage`
- É enviado automaticamente em todas as requisições através de interceptor do Axios
- Rotas protegidas redirecionam para login se não autenticado

## 🎨 Interface

### Página Principal (Home)
- Grid de jogos com imagens
- Busca por nome/descrição
- Cards com informação completa (nome, gênero, empresa, preço)
- Botão de compra direta

### Painel Admin
- **Jogos**: Cadastrar novos jogos com todos os dados
- **Gêneros**: Criar e gerenciar gêneros
- **Empresas**: Adicionar empresas desenvolvedoras
- **Atualizações**: Registrar updates dos jogos

### Design
- **Design moderno** com gradientes roxos/azuis
- **Totalmente responsivo** - funciona em desktop e mobile
- **Feedback visual** com animações suaves
- **Ícones emoji** para uma interface amigável

## 📦 Componentes Principais

### Header
- Exibe logo da loja
- Navegação (Jogos, Meus Pedidos, Admin)
- Menu de usuário com logout
- Botões de login/cadastro para não autenticados

### GameCard
- Exibe jogo com imagem, título, gênero, empresa
- Mostra desconto quando aplicável
- Botão para comprar diretamente

### Admin
- Interface tabbed para gerenciar diferentes entidades
- Formulários completos para CRUD
- Validação de campos
- Feedback de sucesso/erro

## 🚀 Fluxo de Uso

1. **Usuário visita a loja** → Vê todos os jogos disponíveis
2. **Faz login/cadastro** → Acessa funcionalidades completas
3. **Compra jogos** → Clica em "Comprar" no card
4. **Admin gerencia** → Cadastra novos jogos, gêneros, empresas

## 📝 Notas Importantes

- Certifique-se de que o backend está rodando em `http://localhost:8080`
- As imagens dos jogos usam placeholders se não houver URL definida
- A compra é direta (sem carrinho)
- O painel Admin requer autenticação
- Campos obrigatórios são marcados com *

---

Desenvolvido com ❤️ usando React + Vite

