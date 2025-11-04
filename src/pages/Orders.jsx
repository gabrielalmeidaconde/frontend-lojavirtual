import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jogoService } from '../services/api';
import GameCard from '../components/GameCard';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const { data } = await jogoService.listComprados(user.email);
        // Backend retorna ResponseJogoDTO; adaptar para GameCard se necessário
        setGames(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Erro ao carregar pedidos:', e);
        setError('Não foi possível carregar seus pedidos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  if (!user) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <span className="no-orders-icon">🔐</span>
          <h2>Faça login para ver seus pedidos</h2>
          <p>Entre na sua conta para acessar seus jogos comprados.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <div className="spinner" />
          <h2>Carregando seus pedidos…</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <span className="no-orders-icon">⚠️</span>
          <h2>Ocorreu um erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!games.length) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <span className="no-orders-icon">📦</span>
          <h2>Nenhum pedido encontrado</h2>
          <p>Você ainda não realizou nenhuma compra.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 style={{ color: 'white', marginBottom: '1rem' }}>Meus Pedidos</h2>
      <div className="orders-grid">
        {games.map((g) => (
          <GameCard key={g.id} game={g} showBuyButton={false} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
