import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { useState } from 'react';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleUpdateQuantity = async (gameId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(gameId, newQuantity);
  };

  const handleRemove = async (gameId) => {
    if (confirm('Deseja remover este item do carrinho?')) {
      await removeFromCart(gameId);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    if (!confirm('Confirmar pedido?')) {
      return;
    }

    try {
      setProcessing(true);
      const orderData = {
        items: cart.items.map(item => ({
          gameId: item.game.id,
          quantity: item.quantity,
          price: item.game.price,
        })),
        total: cart.total,
      };

      await orderService.create(orderData);
      await clearCart();
      alert('Pedido realizado com sucesso!');
      navigate('/orders');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-content">
          <span className="empty-icon">🛒</span>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione alguns jogos incríveis ao seu carrinho!</p>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Ver Jogos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Meu Carrinho 🛒</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.game.id} className="cart-item">
                <img
                  src={item.game.imageUrl || 'https://via.placeholder.com/150x200?text=Game'}
                  alt={item.game.title}
                  className="item-image"
                />
                
                <div className="item-details">
                  <h3>{item.game.title}</h3>
                  <p className="item-genre">{item.game.genre}</p>
                  <p className="item-price">R$ {item.game.price.toFixed(2)}</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleUpdateQuantity(item.game.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.game.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-total">
                    R$ {(item.game.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.game.id)}
                    className="remove-button"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumo do Pedido</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'})</span>
              <span>R$ {cart.total.toFixed(2)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>R$ {cart.total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="checkout-button"
              disabled={processing}
            >
              {processing ? 'Processando...' : 'Finalizar Compra'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="continue-shopping-btn"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
