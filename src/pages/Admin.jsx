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
    generoIds: [],
    desenvolvedoraId: ''
  });

  const [editingJogo, setEditingJogo] = useState(null);

  // Estados para criação rápida no formulário de jogos
  const [showNovaEmpresaModal, setShowNovaEmpresaModal] = useState(false);
  const [showNovoGeneroModal, setShowNovoGeneroModal] = useState(false);
  const [novaEmpresaNome, setNovaEmpresaNome] = useState('');
  const [novoGeneroNome, setNovoGeneroNome] = useState('');
  const [novoGeneroDescricao, setNovoGeneroDescricao] = useState('');

  // Estados para Atualização
  const [atualizacaoForm, setAtualizacaoForm] = useState({
    versao: '',
    descricao: '',
    jogoId: ''
  });
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  // Carregar dados ao mudar de aba
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'atualizacoes') {
        // Carregar atualizações e jogos para a lista de seleção
        const [atualizacoesRes, jogosRes] = await Promise.all([
          atualizacaoService.getAll(),
          jogoService.getAll()
        ]);
        setAtualizacoes(atualizacoesRes.data);
        setJogos(jogosRes.data);
      } else if (activeTab === 'jogos') {
        // Carregar jogos, gêneros e empresas para os dropdowns
        const [jogosRes, generosRes, empresasRes] = await Promise.all([
          jogoService.getAll(),
          generoService.getAll(),
          empresaService.getAll()
        ]);
        setJogos(jogosRes.data);
        setGeneros(generosRes.data);
        setEmpresas(empresasRes.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleJogoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jogoData = {
        nome: jogoForm.nome,
        descricao: jogoForm.descricao,
        preco: parseFloat(jogoForm.preco),
        desconto: parseInt(jogoForm.desconto) || 0,
        imagemUrl: jogoForm.imagemUrl,
        generoIds: jogoForm.generoIds.map(id => parseInt(id)),
        desenvolvedoraId: parseInt(jogoForm.desenvolvedoraId)
      };

      // Validação
      if (jogoData.generoIds.length === 0) {
        alert('Por favor, selecione pelo menos um gênero!');
        setLoading(false);
        return;
      }

      console.log('📤 Enviando dados do jogo:', jogoData);
      console.log('📝 Descrição sendo enviada:', jogoData.descricao);
      console.log('📏 Tamanho da descrição:', jogoData.descricao?.length);

      if (editingJogo) {
        // Modo edição - PUT
        console.log('✏️ Modo PUT - ID:', editingJogo.id);
        const response = await jogoService.update({ id: editingJogo.id, ...jogoData });
        console.log('✅ Resposta do PUT:', response.data);
        alert('Jogo atualizado com sucesso! 🎮');
        setEditingJogo(null);
      } else {
        // Modo criação - POST
        console.log('➕ Modo POST');
        const response = await jogoService.create(jogoData);
        console.log('✅ Resposta do POST:', response.data);
        alert('Jogo criado com sucesso! 🎮');
      }

      // Limpar formulário
      setJogoForm({
        nome: '',
        descricao: '',
        preco: '',
        desconto: 0,
        imagemUrl: '',
        generoIds: [],
        desenvolvedoraId: ''
      });
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      alert('Erro ao salvar jogo: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditJogo = (jogo) => {
    console.log('📝 Editando jogo:', jogo);
    setEditingJogo(jogo);
    
    // Extrair IDs dos gêneros (suporta array de objetos ou array de strings)
    let generoIds = [];
    if (jogo.generos && Array.isArray(jogo.generos)) {
      if (jogo.generos.length > 0) {
        if (typeof jogo.generos[0] === 'string') {
          // Se for array de strings, precisamos buscar os IDs correspondentes
          generoIds = generos
            .filter(g => jogo.generos.includes(g.nome))
            .map(g => g.id.toString());
        } else if (typeof jogo.generos[0] === 'object') {
          // Se for array de objetos
          generoIds = jogo.generos.map(g => g.id.toString());
        }
      }
    }
    
    // Extrair ID da desenvolvedora (suporta objeto ou string)
    let desenvolvedoraId = '';
    if (jogo.desenvolvedora) {
      if (typeof jogo.desenvolvedora === 'string') {
        // Se for string, buscar o ID correspondente
        const dev = empresas.find(e => e.nome === jogo.desenvolvedora);
        desenvolvedoraId = dev ? dev.id.toString() : '';
      } else if (typeof jogo.desenvolvedora === 'object') {
        // Se for objeto
        desenvolvedoraId = jogo.desenvolvedora.id.toString();
      }
    }
    
    setJogoForm({
      nome: jogo.nome || '',
      descricao: jogo.descricao || '',
      preco: jogo.preco ? jogo.preco.toString() : '',
      desconto: jogo.desconto || 0,
      imagemUrl: jogo.imagemUrl || '',
      generoIds: generoIds,
      desenvolvedoraId: desenvolvedoraId
    });
    
    console.log('📋 Formulário preenchido:', {
      nome: jogo.nome,
      preco: jogo.preco,
      desconto: jogo.desconto,
      generoIds: generoIds,
      desenvolvedoraId: desenvolvedoraId
    });
    
    // Scroll para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingJogo(null);
    setJogoForm({
      nome: '',
      descricao: '',
      preco: '',
      desconto: 0,
      imagemUrl: '',
      generoIds: [],
      desenvolvedoraId: ''
    });
  };

  const handleDeleteJogo = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este jogo?')) return;
    
    try {
      await jogoService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erro ao deletar jogo:', error);
      alert('Erro ao deletar jogo: ' + (error.response?.data?.message || error.message));
    }
  };

  // Funções para criação rápida de Empresa
  const handleCriarNovaEmpresa = async () => {
    if (!novaEmpresaNome.trim()) {
      alert('Por favor, digite o nome da empresa!');
      return;
    }

    try {
      setLoading(true);
      const response = await empresaService.create({ nome: novaEmpresaNome });
      console.log('✅ Nova empresa criada:', response.data);
      
      // Recarregar lista de empresas
      const empresasResponse = await empresaService.getAll();
      setEmpresas(empresasResponse.data);
      
      // Selecionar automaticamente a nova empresa
      const novaEmpresa = response.data;
      setJogoForm({...jogoForm, desenvolvedoraId: novaEmpresa.id.toString()});
      
      // Fechar modal e limpar
      setShowNovaEmpresaModal(false);
      setNovaEmpresaNome('');
      alert(`Empresa "${novaEmpresaNome}" criada com sucesso! 🏢`);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      alert('Erro ao criar empresa: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Funções para criação rápida de Gênero
  const handleCriarNovoGenero = async () => {
    if (!novoGeneroNome.trim()) {
      alert('Por favor, digite o nome do gênero!');
      return;
    }

    try {
      setLoading(true);
      const response = await generoService.create({ 
        nome: novoGeneroNome,
        descricao: novoGeneroDescricao 
      });
      console.log('✅ Novo gênero criado:', response.data);
      
      // Recarregar lista de gêneros
      const generosResponse = await generoService.getAll();
      setGeneros(generosResponse.data);
      
      // Adicionar automaticamente o novo gênero à seleção
      const novoGenero = response.data;
      setJogoForm({
        ...jogoForm, 
        generoIds: [...jogoForm.generoIds, novoGenero.id.toString()]
      });
      
      // Fechar modal e limpar
      setShowNovoGeneroModal(false);
      setNovoGeneroNome('');
      setNovoGeneroDescricao('');
      alert(`Gênero "${novoGeneroNome}" criado com sucesso! 🎯`);
    } catch (error) {
      console.error('Erro ao criar gênero:', error);
      alert('Erro ao criar gênero: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para incrementar versão (patch)
  const incrementarVersaoPatch = (versaoAtual) => {
    try {
      if (!versaoAtual) return '1.0.1';
      const partes = versaoAtual.split('.');
      if (partes.length !== 3) return '1.0.1';
      
      const major = parseInt(partes[0]);
      const minor = parseInt(partes[1]);
      const patch = parseInt(partes[2]) + 1; // Incrementa o patch
      
      return `${major}.${minor}.${patch}`;
    } catch (error) {
      console.error('Erro ao incrementar versão:', error);
      return '1.0.1';
    }
  };

  // Handler para selecionar jogo na lista de atualizações
  const handleSelectJogoForAtualizacao = (jogo) => {
    console.log('🎮 Jogo selecionado para atualização:', jogo);
    console.log('📦 Última versão:', jogo.ultimaVersao);
    
    setJogoSelecionado(jogo);
    
    // Sugerir próxima versão automaticamente
    const proximaVersao = incrementarVersaoPatch(jogo.ultimaVersao || '1.0.0');
    console.log('✨ Próxima versão sugerida:', proximaVersao);
    
    setAtualizacaoForm({
      ...atualizacaoForm,
      jogoId: jogo.id.toString(),
      versao: proximaVersao // Preenche automaticamente
    });
    
    // Scroll para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAtualizacaoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Usa a data/hora UTC atual automaticamente
      const dataAtual = new Date().toISOString();
      
      await atualizacaoService.create({
        versao: atualizacaoForm.versao,
        descricao: atualizacaoForm.descricao,
        data: dataAtual, // Envia data UTC atual
        jogoId: parseInt(atualizacaoForm.jogoId)
      });
      alert('Atualização criada com sucesso! 🔄');
      setAtualizacaoForm({
        versao: '',
        descricao: '',
        jogoId: ''
      });
      setJogoSelecionado(null); // Limpa o jogo selecionado
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
            className={activeTab === 'atualizacoes' ? 'tab-active' : ''}
            onClick={() => setActiveTab('atualizacoes')}
          >
            🔄 Atualizações
          </button>
        </div>

        <div className="admin-content">
          {/* FORMULÁRIO DE JOGOS */}
          {activeTab === 'jogos' && (
            <>
              <form onSubmit={handleJogoSubmit} className="admin-form">
                <h2>{editingJogo ? '✏️ Editar Jogo' : '➕ Cadastrar Novo Jogo'}</h2>
                
                {editingJogo && (
                  <div className="editing-banner">
                    <span>Editando: <strong>{editingJogo.nome}</strong></span>
                    <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
                      ✕ Cancelar Edição
                    </button>
                  </div>
                )}

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
                  <label>URL da Imagem *</label>
                  <input
                    type="url"
                    value={jogoForm.imagemUrl}
                    onChange={(e) => setJogoForm({...jogoForm, imagemUrl: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-header-with-button">
                    <label>Gêneros * (Segure Ctrl/Cmd para selecionar múltiplos)</label>
                    <button 
                      type="button" 
                      className="add-new-btn"
                      onClick={() => setShowNovoGeneroModal(true)}
                    >
                      + Novo Gênero
                    </button>
                  </div>
                  <select
                    multiple
                    value={jogoForm.generoIds}
                    onChange={(e) => {
                      const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                      setJogoForm({...jogoForm, generoIds: selectedIds});
                    }}
                    required
                    size="5"
                    className="multi-select"
                  >
                    {generos.map(genero => (
                      <option key={genero.id} value={genero.id}>
                        {genero.nome}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">
                    ✅ Múltiplos gêneros suportados!
                    <br />
                    Selecionados: {jogoForm.generoIds.length > 0 
                      ? generos.filter(g => jogoForm.generoIds.includes(g.id.toString())).map(g => g.nome).join(', ')
                      : 'Nenhum'
                    }
                  </small>
                </div>

                <div className="form-group">
                  <div className="form-header-with-button">
                    <label>Desenvolvedora *</label>
                    <button 
                      type="button" 
                      className="add-new-btn"
                      onClick={() => setShowNovaEmpresaModal(true)}
                    >
                      + Nova Empresa
                    </button>
                  </div>
                  <select
                    value={jogoForm.desenvolvedoraId}
                    onChange={(e) => setJogoForm({...jogoForm, desenvolvedoraId: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma desenvolvedora</option>
                    {empresas.map(empresa => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Salvando...' : (editingJogo ? '✅ Atualizar Jogo' : '✅ Cadastrar Jogo')}
                </button>
              </form>

              {/* LISTA DE JOGOS */}
              {jogos.length > 0 && (
                <div className="data-list">
                  <h3>📋 Jogos Cadastrados ({jogos.length})</h3>
                  <div className="jogos-list">
                    {jogos.map(jogo => (
                      <div key={jogo.id} className="jogo-card">
                        <button 
                          className="delete-btn-x"
                          onClick={() => handleDeleteJogo(jogo.id)}
                          title="Deletar jogo"
                        >
                          ✕
                        </button>
                        {jogo.imagemUrl && (
                          <img src={jogo.imagemUrl} alt={jogo.nome} className="jogo-thumb" />
                        )}
                        <div className="jogo-info">
                          <h4>{jogo.nome}</h4>
                          <p className="jogo-price">R$ {jogo.preco?.toFixed(2)}</p>
                          {jogo.desconto > 0 && <span className="jogo-discount">-{jogo.desconto}%</span>}
                          <p className="jogo-dev">{jogo.desenvolvedora?.nome}</p>
                          <div className="jogo-genres">
                            {jogo.generos?.map(g => (
                              <span key={g.id} className="genre-tag">{g.nome}</span>
                            ))}
                          </div>
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditJogo(jogo)}
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* FORMULÁRIO DE ATUALIZAÇÕES */}
          {activeTab === 'atualizacoes' && (
            <>
              <form onSubmit={handleAtualizacaoSubmit} className="admin-form">
                <h2>Cadastrar Nova Atualização</h2>
                
                <div className="form-group">
                  <label>
                    Versão *
                    {jogoSelecionado && jogoSelecionado.ultimaVersao && (
                      <span className="version-hint">
                        📦 Última versão: <strong>{jogoSelecionado.ultimaVersao}</strong>
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={atualizacaoForm.versao}
                    onChange={(e) => setAtualizacaoForm({...atualizacaoForm, versao: e.target.value})}
                    placeholder="Ex: 1.0.1, 2.0.0"
                    required
                  />
                  <span className="form-hint">
                    💡 Versão sugerida automaticamente. Você pode alterar manualmente (ex: 2.0.0 para major update).
                  </span>
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
                  <label>Selecione o Jogo *</label>
                  {jogos.length > 0 ? (
                    <div className="jogos-selection-grid">
                      {jogos.map(jogo => (
                        <div 
                          key={jogo.id}
                          className={`jogo-selection-card ${atualizacaoForm.jogoId === jogo.id.toString() ? 'selected' : ''}`}
                          onClick={() => handleSelectJogoForAtualizacao(jogo)}
                        >
                          {jogo.imagemUrl && (
                            <img src={jogo.imagemUrl} alt={jogo.nome} className="jogo-selection-img" />
                          )}
                          <div className="jogo-selection-info">
                            <strong>{jogo.nome}</strong>
                            <span className="jogo-id">ID: {jogo.id}</span>
                            {jogo.ultimaVersao && (
                              <span className="jogo-version">v{jogo.ultimaVersao}</span>
                            )}
                          </div>
                          {atualizacaoForm.jogoId === jogo.id.toString() && (
                            <div className="selected-badge">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data-message">Nenhum jogo cadastrado ainda. Cadastre um jogo primeiro!</p>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading || !atualizacaoForm.jogoId}>
                  {loading ? 'Cadastrando...' : '✅ Cadastrar Atualização'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modal para Nova Empresa */}
      {showNovaEmpresaModal && (
        <div className="modal-overlay" onClick={() => setShowNovaEmpresaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🏢 Criar Nova Empresa</h3>
            
            <div className="form-group">
              <label>Nome da Empresa *</label>
              <input
                type="text"
                value={novaEmpresaNome}
                onChange={(e) => setNovaEmpresaNome(e.target.value)}
                placeholder="Ex: CD Projekt Red, Valve, Mojang"
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => {
                  setShowNovaEmpresaModal(false);
                  setNovaEmpresaNome('');
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleCriarNovaEmpresa}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Empresa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Novo Gênero */}
      {showNovoGeneroModal && (
        <div className="modal-overlay" onClick={() => setShowNovoGeneroModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🎯 Criar Novo Gênero</h3>
            
            <div className="form-group">
              <label>Nome do Gênero *</label>
              <input
                type="text"
                value={novoGeneroNome}
                onChange={(e) => setNovoGeneroNome(e.target.value)}
                placeholder="Ex: Ação, RPG, Aventura"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Descrição (opcional)</label>
              <textarea
                value={novoGeneroDescricao}
                onChange={(e) => setNovoGeneroDescricao(e.target.value)}
                rows="3"
                placeholder="Descreva o gênero..."
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => {
                  setShowNovoGeneroModal(false);
                  setNovoGeneroNome('');
                  setNovoGeneroDescricao('');
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleCriarNovoGenero}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Gênero'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
