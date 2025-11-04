import { useState } from 'react';
import { jogoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, showBuyButton = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Garantir que desconto existe e é um número válido
  const desconto = game.desconto && !isNaN(game.desconto) ? Number(game.desconto) : 0;
  
  const finalPrice = desconto > 0 
    ? (game.preco * (1 - desconto / 100)).toFixed(2)
    : game.preco?.toFixed(2);

  const handleBuyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    setBuying(true);
    setErrorMessage('');
    
    try {
      console.log('🛒 Comprando jogo:', { jogoId: game.id, usuarioemail: user.email });
      await jogoService.comprar(game.id, user.email);
      console.log('✅ Compra realizada com sucesso!');
      setPurchaseSuccess(true);
      
      setTimeout(() => {
        setShowModal(false);
        setPurchaseSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Erro ao comprar jogo:', error);
      setErrorMessage(error.response?.data?.message || 'Erro ao comprar jogo. Tente novamente.');
    } finally {
      setBuying(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPurchaseSuccess(false);
    setErrorMessage('');
  };

  return (
    <div className="game-card">
      <div className="game-image" onClick={() => navigate(`/game/${game.id}`)} style={{ cursor: 'pointer' }}>
        <img 
          src={game.imagemUrl || 'https://via.placeholder.com/300x400?text=Game'} 
          alt={game.nome} 
        />
        {desconto > 0 && (
          <span className="discount-badge">-{desconto}%</span>
        )}
      </div>
      
      <div className="game-content">
        <h3 className="game-title" onClick={() => navigate(`/game/${game.id}`)} style={{ cursor: 'pointer' }}>
          {game.nome}
        </h3>
        <p className="game-genre">
          {game.generos && game.generos.length > 0 
            ? (typeof game.generos[0] === 'string' ? game.generos.join(', ') : game.generos.map(g => g.nome).join(', '))
            : 'Gênero'}
        </p>
        <p className="game-company">
          {game.desenvolvedora 
            ? (typeof game.desenvolvedora === 'string' ? game.desenvolvedora : game.desenvolvedora.nome)
            : 'Desenvolvedora'}
        </p>
        <p className="game-description">{game.descricao}</p>
        
        <div className="game-footer">
          <div className="game-price">
            {desconto > 0 ? (
              <>
                <span className="original-price">R$ {game.preco?.toFixed(2)}</span>
                <span className="discounted-price">
                  R$ {(game.preco * (1 - desconto / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="price">R$ {game.preco?.toFixed(2)}</span>
            )}
          </div>
          
          <div className="game-actions">
            <button 
              className="details-btn" 
              onClick={() => navigate(`/game/${game.id}`)}
            >
              📖 Detalhes
            </button>
            {showBuyButton && (
              <button 
                className="buy-btn" 
                onClick={handleBuyClick}
                disabled={buying}
              >
                💎 Comprar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {purchaseSuccess ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Compra realizada com sucesso!</h3>
                <p>🎮 Aproveite seu jogo!</p>
              </div>
            ) : (
              <>
                <h3>Confirmar Compra</h3>
                <div className="modal-game-info">
                  <img src={game.imagemUrl || 'https://via.placeholder.com/100x140?text=Game'} alt={game.nome} />
                  <div>
                    <h4>{game.nome}</h4>
                    <p className="modal-price">R$ {finalPrice}</p>
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="error-message">
                    ❌ {errorMessage}
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    className="btn-cancel" 
                    onClick={handleCloseModal}
                    disabled={buying}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn-confirm" 
                    onClick={handleConfirmPurchase}
                    disabled={buying}
                  >
                    {buying ? 'Processando...' : 'Confirmar Compra'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
