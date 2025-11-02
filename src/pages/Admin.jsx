import { useState, useEffect } from 'react';
import { jogoService, generoService, empresaService, atualizacaoService } from '../services/api';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('jogos');
  const [loading, setLoading] = useState(false);

  // Estados para listas
  const [generos, setGeneros] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [atualizacoes, setAtualizacoes] = useState([]);
  const [jogos, setJogos] = useState([]);

  // Estados para Jogo
  const [jogoForm, setJogoForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    desconto: 0,
    imagemUrl: '',
    generoId: '',
    empresaId: ''
  });

  // Estados para Gênero
  const [generoForm, setGeneroForm] = useState({
    nome: '',
    descricao: ''
  });

  // Estados para Empresa
  const [empresaForm, setEmpresaForm] = useState({
    nome: ''
  });

  // Estados para Atualização
  const [atualizacaoForm, setAtualizacaoForm] = useState({
    versao: '',
    descricao: '',
    dataLancamento: '',
    jogoId: ''
  });

  // Carregar dados ao mudar de aba
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'generos') {
        const response = await generoService.getAll();
        setGeneros(response.data);
      } else if (activeTab === 'empresas') {
        const response = await empresaService.getAll();
        setEmpresas(response.data);
      } else if (activeTab === 'atualizacoes') {
        const response = await atualizacaoService.getAll();
        setAtualizacoes(response.data);
      } else if (activeTab === 'jogos') {
        const response = await jogoService.getAll();
        setJogos(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleJogoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jogoService.create({
        ...jogoForm,
        preco: parseFloat(jogoForm.preco),
        desconto: parseInt(jogoForm.desconto) || 0,
        generoId: parseInt(jogoForm.generoId),
        empresaId: parseInt(jogoForm.empresaId)
      });
      alert('Jogo criado com sucesso! 🎮');
      setJogoForm({
        nome: '',
        descricao: '',
        preco: '',
        desconto: 0,
        imagemUrl: '',
        generoId: '',
        empresaId: ''
      });
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      alert('Erro ao criar jogo: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGeneroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await generoService.create(generoForm);
      alert('Gênero criado com sucesso! 🎯');
      setGeneroForm({ nome: '', descricao: '' });
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao criar gênero:', error);
      alert('Erro ao criar gênero: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('📤 Criando empresa:', empresaForm);
      await empresaService.create(empresaForm);
      alert('Empresa criada com sucesso! 🏢');
      setEmpresaForm({ nome: '' });
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      alert('Erro ao criar empresa: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizacaoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await atualizacaoService.create({
        ...atualizacaoForm,
        jogoId: parseInt(atualizacaoForm.jogoId)
      });
      alert('Atualização criada com sucesso! 🔄');
      setAtualizacaoForm({
        versao: '',
        descricao: '',
        dataLancamento: '',
        jogoId: ''
      });
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao criar atualização:', error);
      alert('Erro ao criar atualização: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Painel Administrativo 🎮</h1>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'jogos' ? 'tab-active' : ''}
            onClick={() => setActiveTab('jogos')}
          >
            🎮 Jogos
          </button>
          <button 
            className={activeTab === 'generos' ? 'tab-active' : ''}
            onClick={() => setActiveTab('generos')}
          >
            🎯 Gêneros
          </button>
          <button 
            className={activeTab === 'empresas' ? 'tab-active' : ''}
            onClick={() => setActiveTab('empresas')}
          >
            🏢 Empresas
          </button>
          <button 
            className={activeTab === 'atualizacoes' ? 'tab-active' : ''}
            onClick={() => setActiveTab('atualizacoes')}
          >
            🔄 Atualizações
          </button>
        </div>

        <div className="admin-content">
          {/* FORMULÁRIO DE JOGOS */}
          {activeTab === 'jogos' && (
            <form onSubmit={handleJogoSubmit} className="admin-form">
              <h2>Cadastrar Novo Jogo</h2>
              
              <div className="form-group">
                <label>Nome do Jogo *</label>
                <input
                  type="text"
                  value={jogoForm.nome}
                  onChange={(e) => setJogoForm({...jogoForm, nome: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  value={jogoForm.descricao}
                  onChange={(e) => setJogoForm({...jogoForm, descricao: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={jogoForm.preco}
                    onChange={(e) => setJogoForm({...jogoForm, preco: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Desconto (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={jogoForm.desconto}
                    onChange={(e) => setJogoForm({...jogoForm, desconto: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL da Imagem</label>
                <input
                  type="url"
                  value={jogoForm.imagemUrl}
                  onChange={(e) => setJogoForm({...jogoForm, imagemUrl: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ID do Gênero *</label>
                  <input
                    type="number"
                    value={jogoForm.generoId}
                    onChange={(e) => setJogoForm({...jogoForm, generoId: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ID da Empresa *</label>
                  <input
                    type="number"
                    value={jogoForm.empresaId}
                    onChange={(e) => setJogoForm({...jogoForm, empresaId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Cadastrando...' : '✅ Cadastrar Jogo'}
              </button>
            </form>
          )}

          {/* FORMULÁRIO DE GÊNEROS */}
          {activeTab === 'generos' && (
            <form onSubmit={handleGeneroSubmit} className="admin-form">
              <h2>Cadastrar Novo Gênero</h2>
              
              <div className="form-group">
                <label>Nome do Gênero *</label>
                <input
                  type="text"
                  value={generoForm.nome}
                  onChange={(e) => setGeneroForm({...generoForm, nome: e.target.value})}
                  placeholder="Ex: Ação, RPG, Aventura"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={generoForm.descricao}
                  onChange={(e) => setGeneroForm({...generoForm, descricao: e.target.value})}
                  rows="4"
                  placeholder="Descreva o gênero..."
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Cadastrando...' : '✅ Cadastrar Gênero'}
              </button>
            </form>
          )}

          {/* LISTA DE GÊNEROS */}
          {activeTab === 'generos' && generos.length > 0 && (
            <div className="data-list">
              <h3>📋 Gêneros Cadastrados ({generos.length})</h3>
              <div className="list-grid">
                {generos.map(genero => (
                  <div key={genero.id} className="list-item">
                    <strong>ID {genero.id}:</strong> {genero.nome}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE EMPRESAS */}
          {activeTab === 'empresas' && (
            <form onSubmit={handleEmpresaSubmit} className="admin-form">
              <h2>Cadastrar Nova Empresa</h2>
              
              <div className="form-group">
                <label>Nome da Empresa *</label>
                <input
                  type="text"
                  value={empresaForm.nome}
                  onChange={(e) => setEmpresaForm({...empresaForm, nome: e.target.value})}
                  placeholder="Ex: Valve, Mojang Studios, Re-Logic"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Cadastrando...' : '✅ Cadastrar Empresa'}
              </button>
            </form>
          )}

          {/* LISTA DE EMPRESAS */}
          {activeTab === 'empresas' && empresas.length > 0 && (
            <div className="data-list">
              <h3>📋 Empresas Cadastradas ({empresas.length})</h3>
              <div className="list-grid">
                {empresas.map(empresa => (
                  <div key={empresa.id} className="list-item">
                    <strong>ID {empresa.id}:</strong> {empresa.nome}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE ATUALIZAÇÕES */}
          {activeTab === 'atualizacoes' && (
            <form onSubmit={handleAtualizacaoSubmit} className="admin-form">
              <h2>Cadastrar Nova Atualização</h2>
              
              <div className="form-group">
                <label>Versão *</label>
                <input
                  type="text"
                  value={atualizacaoForm.versao}
                  onChange={(e) => setAtualizacaoForm({...atualizacaoForm, versao: e.target.value})}
                  placeholder="Ex: 1.0.0, 2.3.1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  value={atualizacaoForm.descricao}
                  onChange={(e) => setAtualizacaoForm({...atualizacaoForm, descricao: e.target.value})}
                  rows="4"
                  placeholder="Descreva as mudanças desta atualização..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Data de Lançamento *</label>
                <input
                  type="date"
                  value={atualizacaoForm.dataLancamento}
                  onChange={(e) => setAtualizacaoForm({...atualizacaoForm, dataLancamento: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>ID do Jogo *</label>
                <input
                  type="number"
                  value={atualizacaoForm.jogoId}
                  onChange={(e) => setAtualizacaoForm({...atualizacaoForm, jogoId: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Cadastrando...' : '✅ Cadastrar Atualização'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
