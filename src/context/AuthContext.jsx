import { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token armazenado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      console.log('🟢 [AuthContext] Tentando login com:', { email });
      const response = await usuarioService.login({ email, password: senha });
      console.log('🟢 [AuthContext] Resposta do login:', response.data);
      
      // Backend só retorna o token, não retorna dados do usuário
      // Então criamos um objeto com o email que já temos
      const token = response.data;
      const userData = { email }; // Usamos o email do formulário
      
      console.log('🟢 [AuthContext] Token recebido');
      console.log('🟢 [AuthContext] Dados do usuário:', userData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('🟢 [AuthContext] Login bem-sucedido!');
      return { success: true };
    } catch (error) {
      console.error('🔴 [AuthContext] Erro no login:', error);
      console.error('🔴 [AuthContext] Response:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🟢 [AuthContext] Dados recebidos:', userData);
      console.log('🟢 [AuthContext] Enviando POST para /usuarios...');
      
      await usuarioService.register(userData);
      
      console.log('🟢 [AuthContext] Usuário registrado! Fazendo login automático...');
      
      // Após registrar, faz login automaticamente
      const loginResult = await login(userData.email, userData.password);
      return loginResult;
      
    } catch (error) {
      console.error('🔴 [AuthContext] ERRO NO REGISTRO:', error);
      console.error('🔴 [AuthContext] Status:', error.response?.status);
      console.error('🔴 [AuthContext] Dados do erro:', error.response?.data);
      console.error('🔴 [AuthContext] Mensagem:', error.message);
      
      let errorMessage = 'Erro ao registrar';
      
      if (error.message === 'Network Error') {
        errorMessage = '❌ Backend não está respondendo! Verifique se está rodando em http://localhost:8080';
      } else if (error.response?.status === 404) {
        errorMessage = '❌ Rota /usuarios não encontrada no backend';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
