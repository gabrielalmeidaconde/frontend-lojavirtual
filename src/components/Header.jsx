import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎮</span>
          <span className="logo-text">GameStore</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Jogos</Link>
          {user && (
            <>
              <Link to="/orders" className="nav-link">Meus Pedidos</Link>
              <Link to="/admin" className="nav-link">Admin</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-email">👤 {user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-button">Entrar</Link>
              <Link to="/register" className="register-button">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
