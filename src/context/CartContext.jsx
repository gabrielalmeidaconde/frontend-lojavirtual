import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (gameId, quantity = 1) => {
    try {
      const response = await cartService.addItem(gameId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao adicionar ao carrinho' 
      };
    }
  };

  const updateQuantity = async (gameId, quantity) => {
    try {
      const response = await cartService.updateItem(gameId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao atualizar quantidade' 
      };
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const response = await cartService.removeItem(gameId);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao remover do carrinho' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clear();
      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao limpar carrinho' 
      };
    }
  };

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
