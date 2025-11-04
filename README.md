# 🎮 GameStore - Loja Virtual de Jogos

Uma loja virtual moderna de jogos desenvolvida com React + Vite, integrada com backend Spring Boot.

### Por: Miguel Damásio, Gabriel Condé, Enzo Canavero e Victor Pimenta.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (v16 ou superior)
- Backend rodando em `http://localhost:8080`

### Instalação e Execução

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - Abra o navegador em `http://localhost:5173`
   - Se a porta 5173 estiver ocupada, o Vite usará automaticamente a próxima disponível (ex: 5174)

### Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

---

## 🎯 Funcionalidades

- ✅ Navegação e busca de jogos
- ✅ Sistema de autenticação (Login/Registro)
- ✅ Compra direta de jogos com modal de confirmação
- ✅ Visualização de detalhes do jogo com atualizações
- ✅ Painel administrativo completo
- ✅ Gerenciamento de jogos com suporte a múltiplos gêneros
- ✅ Criação inline de empresas e gêneros no formulário de jogos
- ✅ Sistema de descontos automático
- ✅ Versionamento automático de atualizações
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
├── components/            # Componentes reutilizáveis
│   ├── Header.jsx        # Cabeçalho com navegação e auth
│   └── GameCard.jsx      # Card de jogo com compra
├── pages/                # Páginas da aplicação
│   ├── Home.jsx          # Listagem de jogos
│   ├── GameDetails.jsx   # Detalhes do jogo + atualizações
│   ├── Login.jsx         # Página de login
│   ├── Register.jsx      # Página de cadastro
│   ├── Cart.jsx          # Carrinho de compras
│   ├── Orders.jsx        # Histórico de pedidos
│   └── Admin.jsx         # Painel administrativo
├── context/              # Contextos React
│   ├── AuthContext.jsx   # Gerenciamento de autenticação
│   └── CartContext.jsx   # Gerenciamento do carrinho
├── services/             # Serviços de API
│   └── api.js            # Configuração do Axios e endpoints
├── App.jsx               # Componente principal e rotas
└── main.jsx              # Ponto de entrada
```

## 🔌 Endpoints da API

O frontend se conecta aos seguintes endpoints do backend:

### 🎮 Jogos (`/jogos`)
- `GET /jogos` - Listar todos os jogos (retorna desconto e ultimaVersao)
- `GET /jogos/{id}` - Buscar jogo por ID com detalhes completos
- `POST /jogos` - Criar novo jogo (suporta múltiplos gêneros via generoIds[])
- `PUT /jogos` - Atualizar jogo
- `DELETE /jogos/{id}` - Deletar jogo
- `POST /jogos/{id}/comprar` - Comprar um jogo

**Formato de resposta esperado:**
```json
{
  "id": 1,
  "nome": "The Witcher 3",
  "descricao": "RPG de mundo aberto...",
  "preco": 59.99,
  "desconto": 20,
  "imagemUrl": "https://...",
  "generos": ["RPG", "Ação"],
  "desenvolvedora": "CD Projekt Red",
  "usuariosCount": 150,
  "ultimaVersao": "1.0.5"
}
```

### 🎯 Gêneros (`/generos`)
- `GET /generos` - Listar todos os gêneros
- `POST /generos` - Criar novo gênero
- `DELETE /generos/{id}` - Deletar gênero

### 🏢 Empresas (`/empresas`)
- `GET /empresas` - Listar todas as empresas
- `POST /empresas` - Criar nova empresa
- `DELETE /empresas/{id}` - Deletar empresa

**Observação:** Gêneros e empresas podem ser criados inline no formulário de jogos através de modais.

### 🔄 Atualizações (`/atualizacoes`)
- `GET /atualizacoes` - Listar todas as atualizações
- `POST /atualizacoes` - Criar nova atualização (data gerada automaticamente como UTC)
- `DELETE /atualizacoes/{id}` - Deletar atualização

**Formato de resposta esperado:**
```json
{
  "id": 1,
  "versao": "1.0.6",
  "descricao": "Correção de bugs...",
  "data": "2025-11-02T18:30:00.000Z",
  "jogoId": 1,
  "jogoNome": "The Witcher 3"
}
```

**Observação:** O frontend preenche automaticamente a próxima versão baseada em `ultimaVersao` do jogo.

### 👤 Usuários (`/usuarios`)
- `GET /usuarios` - Listar todos os usuários
- `POST /usuarios` - Cadastrar usuário
- `POST /usuarios/login` - Fazer login

## ⚙️ Configuração da API

O arquivo `src/services/api.js` contém a configuração do Axios:

```javascript
baseURL: 'http://localhost:8080'
```

Se o backend estiver rodando em outra porta ou host, ajuste essa URL conforme necessário.

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:
- O token é armazenado no `localStorage`
- É enviado automaticamente em todas as requisições através de interceptor do Axios
- Rotas protegidas redirecionam para login se não autenticado

## 🎨 Funcionalidades Detalhadas

### Página Principal (Home)
- **Grid responsivo de jogos** com imagens e informações
- **Sistema de descontos** - Exibe preço original riscado e preço com desconto
- **Busca em tempo real** por nome/descrição
- **Cards interativos** com efeito hover
- **Compra direta** via modal de confirmação

### Detalhes do Jogo
- **Informações completas** do jogo (nome, descrição, gêneros, empresa)
- **Sistema de desconto visual** com badge de porcentagem
- **Lista de atualizações** ordenadas por data (mais recente primeiro)
- **Datas em formato local** - Converte UTC para timezone do usuário em dd/mm/yyyy
- **Modal de compra** com confirmação e feedback visual

### Painel Administrativo
- **Aba Jogos:**
  - Cadastro completo com suporte a múltiplos gêneros
  - Upload de imagem via URL
  - Sistema de desconto (0-100%)
  - Edição inline com pré-preenchimento de campos
  - Criação rápida de empresas e gêneros via modais (sem trocar de aba)
  
- **Aba Atualizações:**
  - Seleção visual de jogo via cards clicáveis
  - **Versionamento automático** - Mostra última versão e sugere próxima (ex: 1.0.5 → 1.0.6)
  - Developer pode editar manualmente a versão
  - Data UTC gerada automaticamente no momento do envio
  - Scroll automático para o formulário ao selecionar jogo

### Design
- **Gradientes modernos** em roxo/azul (#667eea → #764ba2)
- **Totalmente responsivo** - Desktop, tablet e mobile
- **Animações suaves** em hover, transições e modais
- **Feedback visual** - Loading states, modals de confirmação, badges
- **Ícones emoji** para interface amigável e intuitiva

## 📦 Componentes Principais

### Header
- Logo da loja com navegação
- Links: Home, Detalhes do Jogo, Meus Pedidos, Admin
- Menu de usuário com logout
- Botões de login/cadastro para visitantes

### GameCard
- Exibe jogo com imagem, título, gêneros, empresa
- **Sistema de desconto visual:**
  - Badge com porcentagem (-20%)
  - Preço original riscado
  - Preço final destacado em verde
- Modal de confirmação de compra
- Feedback de sucesso/erro

### GameDetails
- Layout com imagem grande e informações completas
- Cálculo automático de preço com desconto
- Seção "Sobre o Jogo" com descrição completa
- **Seção "Últimas Atualizações":**
  - Cards de atualização com versão e data
  - Ordenação automática (mais recente primeiro)
  - Formato de data localizado (dd/mm/yyyy)
  - Mensagem quando não há atualizações

### Admin
- **Interface com abas** (Jogos e Atualizações)
- **Formulários completos** com validação
- **Modais inline** para criar empresas/gêneros
- **Edição de jogos** com pré-preenchimento
- **Sistema de versionamento** automático para atualizações
- Feedback de sucesso/erro via alerts
- Loading states em todas as operações

## 🚀 Fluxo de Uso

### Usuário Final:
1. **Visita a loja** → Vê grid de jogos com descontos
2. **Clica em um jogo** → Visualiza detalhes e atualizações
3. **Faz login/cadastro** → Habilita funcionalidades de compra
4. **Compra jogos** → Modal de confirmação → Redirecionamento para pedidos
5. **Visualiza pedidos** → Histórico de compras

### Administrador:
1. **Acessa painel Admin** (requer autenticação)
2. **Aba Jogos:**
   - Cadastra novo jogo com desconto
   - Seleciona múltiplos gêneros
   - Cria empresa/gênero inline se necessário (via modais)
   - Edita jogos existentes (pré-preenchimento automático)
3. **Aba Atualizações:**
   - Clica em um card de jogo
   - Sistema sugere próxima versão automaticamente (ex: 1.0.6)
   - Edita versão manualmente se desejar (ex: 2.0.0 para major update)
   - Escreve descrição das mudanças
   - Envia → Data UTC gerada automaticamente

## 📝 Requisitos do Backend

Para o frontend funcionar corretamente, o backend deve retornar:

### GET /jogos - Campos obrigatórios:
- `id`, `nome`, `descricao`, `preco`
- `desconto` (Integer 0-100, sempre presente)
- `ultimaVersao` (String, ex: "1.0.5", retorna "1.0.0" se sem atualizações)
- `imagemUrl` (String, pode ser null)
- `generos` (Array de strings ou objetos com nome)
- `desenvolvedora` (String ou objeto com nome)
- `usuariosCount` (Integer)

### POST /jogos - Campos aceitos:
- `nome`, `descricao`, `preco`, `desconto`, `imagemUrl`
- `generoIds` (Array de Integers) - Suporte a múltiplos gêneros
- `desenvolvedoraId` (Integer)

### GET /atualizacoes - Campos obrigatórios:
- `id`, `versao`, `descricao`
- `data` (ISO String UTC, ex: "2025-11-02T18:30:00.000Z")
- `jogoId` (Integer)
- `jogoNome` (String)

### POST /atualizacoes - Campos aceitos:
- `versao` (String, ex: "1.0.6")
- `descricao` (String)
- `data` (ISO String UTC, gerado pelo frontend)
- `jogoId` (Integer)

## 🔧 Troubleshooting

### Problema: Jogos não aparecem
- ✅ Verifique se o backend está rodando
- ✅ Confira a URL em `src/services/api.js`
- ✅ Abra o console do navegador para ver erros de rede

### Problema: Desconto não funciona
- ✅ Backend deve retornar campo `desconto` (mesmo se for 0)
- ✅ Valor deve ser Integer entre 0-100

### Problema: Versão de atualização mostra apenas "v"
- ✅ Backend deve retornar campo `versao` nas atualizações
- ✅ Formato esperado: String (ex: "1.0.6")

### Problema: Atualizações não aparecem
- ✅ Backend deve retornar `jogoId` (não `jogo.id`)
- ✅ Campo `data` deve existir (não `dataLancamento`)

### Problema: Erro ao criar jogo com múltiplos gêneros
- ✅ Backend deve aceitar `generoIds` como array
- ✅ Tabela `jogo_genero` deve existir no banco

## 🐳 Docker

Para rodar imagem Docker Linux/AMD64 no Mac:

```bash
docker pull --platform linux/amd64 <image-name>
```

---

## 📝 Notas Importantes

- ✅ Backend obrigatório em `http://localhost:8080`
- ✅ Imagens dos jogos usam URL fornecida ou placeholder
- ✅ Compra é direta (sem carrinho intermediário)
- ✅ Painel Admin requer autenticação
- ✅ Datas sempre em UTC no backend, convertidas para local no frontend
- ✅ Versionamento automático sugere incremento de patch (1.0.5 → 1.0.6)
- ✅ Developer pode editar versão manualmente para major/minor updates
- ✅ Gêneros e empresas podem ser criados sem sair do formulário de jogos

---

Desenvolvido com ❤️ usando React + Vite

