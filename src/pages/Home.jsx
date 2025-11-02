import { useState, useEffect } from 'react';
import { jogoService } from '../services/api';
import GameCard from '../components/GameCard';
import './Home.css';

// Jogos de exemplo para visualização
const JOGOS_EXEMPLO = [
  {
    id: 1,
    nome: 'Half-Life: Alyx',
    descricao: 'Um jogo de tiro em primeira pessoa em realidade virtual ambientado no universo Half-Life. Explore, lute e resolva quebra-cabeças enquanto avança pela história.',
    preco: 299.90,
    desconto: 15,
    imagemUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg',
    genero: { nome: 'VR / FPS' },
    empresa: { nome: 'Valve' }
  },
  {
    id: 2,
    nome: 'Minecraft',
    descricao: 'Jogo sandbox de construção e sobrevivência onde você pode criar qualquer coisa que imaginar. Explore mundos infinitos e construa desde casas simples até castelos grandiosos.',
    preco: 89.90,
    desconto: 0,
    imagemUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202407/1020/91fe046f742042e3b31e57f7731dbe2226e1fd1e02a36223.jpg',
    genero: { nome: 'Sandbox / Aventura' },
    empresa: { nome: 'Mojang Studios' }
  },
  {
    id: 3,
    nome: 'Terraria',
    descricao: 'Jogo de aventura sandbox em 2D com exploração, construção, combate e mineração. Derrote chefes épicos, construa sua base e explore cavernas misteriosas.',
    preco: 37.99,
    desconto: 20,
    imagemUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg',
    genero: { nome: 'Sandbox / Ação' },
    empresa: { nome: 'Re-Logic' }
  }
];

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jogoService.getAll();
      
      // Se não houver jogos no backend, usar jogos de exemplo
      if (response.data && response.data.length > 0) {
        setGames(response.data);
      } else {
        setGames(JOGOS_EXEMPLO);
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      // Em caso de erro, usar jogos de exemplo
      setGames(JOGOS_EXEMPLO);
      setError(null); // Não mostrar erro, apenas usar dados de exemplo
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = searchTerm.trim() 
      ? games.filter(game => 
          game.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : games;
    setGames(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadGames();
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Bem-vindo à GameStore! 🎮</h1>
        <p>Descubra os melhores jogos com os melhores preços</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Buscar
          </button>
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="clear-button"
            >
              Limpar
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadGames}>Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando jogos...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="no-games">
          <p>Nenhum jogo encontrado.</p>
          {searchTerm && (
            <button onClick={handleClearSearch}>
              Ver todos os jogos
            </button>
          )}
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
