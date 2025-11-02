import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== JOGOS ====================
export const jogoService = {
  // GET /jogos - Listar todos os jogos
  getAll: () => api.get('/jogos'),
  
  // GET /jogos/{id} - Buscar jogo por ID
  getById: (id) => api.get(`/jogos/${id}`),
  
  // POST /jogos - Criar novo jogo
  create: (jogoData) => api.post('/jogos', jogoData),
  
  // PUT /jogos - Atualizar jogo
  update: (jogoData) => api.put('/jogos', jogoData),
  
  // DELETE /jogos/{id} - Deletar jogo
  delete: (id) => api.delete(`/jogos/${id}`),
  
  // POST /jogos/{id}/comprar - Comprar um jogo (recebe id do jogo e usuarioemail como query param)
  comprar: (id, usuarioemail) => api.post(`/jogos/${id}/comprar?usuarioemail=${usuarioemail}`),
};

// ==================== GÊNEROS ====================
export const generoService = {
  // GET /generos - Listar todos os gêneros
  getAll: () => api.get('/generos'),
  
  // GET /generos/{id} - Buscar gênero por ID
  getById: (id) => api.get(`/generos/${id}`),
  
  // POST /generos - Criar novo gênero
  create: (generoData) => api.post('/generos', generoData),
  
  // PUT /generos - Atualizar gênero
  update: (generoData) => api.put('/generos', generoData),
  
  // DELETE /generos/{id} - Deletar gênero
  delete: (id) => api.delete(`/generos/${id}`),
};

// ==================== EMPRESAS ====================
export const empresaService = {
  // GET /empresas - Listar todas as empresas
  getAll: () => api.get('/empresas'),
  
  // GET /empresas/{id} - Buscar empresa por ID
  getById: (id) => api.get(`/empresas/${id}`),
  
  // POST /empresas - Criar nova empresa
  create: (empresaData) => api.post('/empresas', empresaData),
  
  // PUT /empresas - Atualizar empresa
  update: (empresaData) => api.put('/empresas', empresaData),
  
  // DELETE /empresas/{id} - Deletar empresa
  delete: (id) => api.delete(`/empresas/${id}`),
};

// ==================== ATUALIZAÇÕES ====================
export const atualizacaoService = {
  // GET /atualizacoes - Listar todas as atualizações
  getAll: () => api.get('/atualizacoes'),
  
  // GET /atualizacoes/{id} - Buscar atualização por ID
  getById: (id) => api.get(`/atualizacoes/${id}`),
  
  // POST /atualizacoes - Criar nova atualização
  create: (atualizacaoData) => api.post('/atualizacoes', atualizacaoData),
  
  // PUT /atualizacoes - Atualizar atualização
  update: (atualizacaoData) => api.put('/atualizacoes', atualizacaoData),
  
  // DELETE /atualizacoes/{id} - Deletar atualização
  delete: (id) => api.delete(`/atualizacoes/${id}`),
};

// ==================== USUÁRIOS ====================
export const usuarioService = {
  // GET /usuarios - Listar todos os usuários
  getAll: () => api.get('/usuarios'),
  
  // POST /usuarios - Criar novo usuário (Registro) - Recebe { email, password }
  register: (usuarioData) => {
    console.log('🟡 [api.js] usuarioService.register chamado com:', usuarioData);
    console.log('🟡 [api.js] Fazendo POST para: http://localhost:8080/usuarios');
    return api.post('/usuarios', usuarioData);
  },
  
  // POST /usuarios/login - Login de usuário - Recebe { email, password }
  login: (credentials) => {
    console.log('🟡 [api.js] usuarioService.login chamado com:', credentials);
    console.log('🟡 [api.js] Fazendo POST para: http://localhost:8080/usuarios/login');
    return api.post('/usuarios/login', credentials);
  },
};

// Manter compatibilidade com código antigo (aliases)
export const gameService = jogoService;
export const userService = usuarioService;

export default api;
