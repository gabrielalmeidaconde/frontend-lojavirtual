import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jogoService, atualizacaoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './GameDetails.css';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jogo, setJogo] = useState(null);
  const [atualizacoes, setAtualizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadGameDetails();
  }, [id]);

  const loadGameDetails = async () => {
    try {
      setLoading(true);
      
      // Carregar detalhes do jogo
      const jogoResponse = await jogoService.getById(id);
      console.log('🎮 Dados do jogo recebidos:', jogoResponse.data);
      console.log('💰 Desconto recebido:', jogoResponse.data.desconto);
      setJogo(jogoResponse.data);

      // Carregar atualizações do jogo
      try {
        const atualizacoesResponse = await atualizacaoService.getAll();
        console.log('🔄 Todas as atualizações recebidas:', atualizacoesResponse.data);
        console.log('🎯 ID do jogo atual:', id, 'tipo:', typeof id);
        
        // Filtrar atualizações deste jogo (backend retorna jogoId diretamente)
        const jogoAtualizacoes = atualizacoesResponse.data.filter(atualiz => {
          console.log('📋 Atualização:', atualiz.id, 'jogoId:', atualiz.jogoId, 'tipo:', typeof atualiz.jogoId);
          return atualiz.jogoId === parseInt(id);
        });
        
        console.log('✅ Atualizações filtradas:', jogoAtualizacoes);
        
        // Ordenar por data (mais recente primeiro) - backend usa 'data' não 'dataLancamento'
        jogoAtualizacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
        setAtualizacoes(jogoAtualizacoes);
      } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
        setAtualizacoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do jogo:', error);
      alert('Erro ao carregar jogo: ' + (error.response?.data?.message || error.message));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = () => {
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
      console.log('🛒 Comprando jogo:', { jogoId: jogo.id, usuarioemail: user.email });
      await jogoService.comprar(jogo.id, user.email);
      console.log('✅ Compra realizada com sucesso!');
      setPurchaseSuccess(true);
      
      setTimeout(() => {
        setShowModal(false);
        setPurchaseSuccess(false);
        navigate('/orders'); // Redireciona para página de pedidos
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

  const calcularPrecoFinal = () => {
    if (!jogo) return 0;
    const desconto = jogo.desconto && !isNaN(jogo.desconto) ? Number(jogo.desconto) : 0;
    if (desconto > 0) {
      return jogo.preco - (jogo.preco * desconto / 100);
    }
    return jogo.preco;
  };

  const getDesconto = () => {
    if (!jogo) return 0;
    return jogo.desconto && !isNaN(jogo.desconto) ? Number(jogo.desconto) : 0;
  };

  const formatarData = (data) => {
    // Converte UTC para timezone local do usuário e exibe em dd/mm/yyyy
    const date = new Date(data);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando jogo...</p>
      </div>
    );
  }

  if (!jogo) {
    return (
      <div className="game-details-page">
        <div className="error-message">
          <h2>Jogo não encontrado</h2>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-details-page">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Voltar
      </button>

      <div className="game-details-container">
        {/* Header do Jogo */}
        <div className="game-header">
          <div className="game-image-section">
            {jogo.imagemUrl ? (
              <img src={jogo.imagemUrl} alt={jogo.nome} className="game-image-large" />
            ) : (
              <div className="game-image-placeholder">
                <span>🎮</span>
                <p>Sem imagem disponível</p>
              </div>
            )}
          </div>

          <div className="game-info-section">
            <h1>{jogo.nome}</h1>
            
            <div className="game-meta">
              <div className="game-developer">
                <span className="meta-label">Desenvolvedora:</span>
                <span className="meta-value">
                  {jogo.desenvolvedora 
                    ? (typeof jogo.desenvolvedora === 'string' ? jogo.desenvolvedora : jogo.desenvolvedora.nome)
                    : 'N/A'}
                </span>
              </div>
              
              <div className="game-genres">
                <span className="meta-label">Gêneros:</span>
                <div className="genres-list">
                  {jogo.generos && jogo.generos.length > 0 ? (
                    jogo.generos.map((genero, index) => (
                      <span key={index} className="genre-badge">
                        {typeof genero === 'string' ? genero : genero.nome}
                      </span>
                    ))
                  ) : (
                    <span className="meta-value">N/A</span>
                  )}
                </div>
              </div>
            </div>

            <div className="game-pricing">
              {getDesconto() > 0 ? (
                <>
                  <div className="price-discount">
                    <span className="discount-badge">-{getDesconto()}%</span>
                    <div className="price-values">
                      <span className="price-original">R$ {jogo.preco?.toFixed(2)}</span>
                      <span className="price-final">R$ {calcularPrecoFinal().toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="price-regular">
                  <span className="price-final">R$ {jogo.preco?.toFixed(2)}</span>
                </div>
              )}
            </div>

            <button onClick={handlePlayGame} className="buy-btn-large">
              💎 Comprar Agora
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div className="game-description-section">
          <h2>Sobre o Jogo</h2>
          <p className="game-description">{jogo.descricao}</p>
        </div>

        {/* Atualizações */}
        <div className="game-updates-section">
          <h2>Últimas Atualizações</h2>
          {atualizacoes.length > 0 ? (
            <div className="updates-list">
              {atualizacoes.map(atualizacao => (
                <div key={atualizacao.id} className="update-card">
                  <div className="update-header">
                    <span className="update-version">
                      {atualizacao.versao ? `v${atualizacao.versao}` : `Atualização #${atualizacao.id}`}
                    </span>
                    <span className="update-date">
                      {formatarData(atualizacao.data)}
                    </span>
                  </div>
                  <div className="update-description">
                    <p>{atualizacao.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-updates">
              <p>📦 Nenhuma atualização disponível para este jogo.</p>
            </div>
          )}
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
                <p>🎮 Redirecionando para seus jogos...</p>
              </div>
            ) : (
              <>
                <h3>Confirmar Compra</h3>
                <div className="modal-game-info">
                  <img src={jogo.imagemUrl || 'https://via.placeholder.com/100x140?text=Game'} alt={jogo.nome} />
                  <div>
                    <h4>{jogo.nome}</h4>
                    <p className="modal-price">R$ {calcularPrecoFinal().toFixed(2)}</p>
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="error-message-modal">
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

export default GameDetails;
