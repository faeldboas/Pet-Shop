// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let produtosAdmin = [];
let agendamentosAdmin = [];
let mesAtualAdmin = new Date().getMonth();
let anoAtualAdmin = new Date().getFullYear();
let diaSelecionadoAdmin = null;
let produtoEditando = null;

// Credenciais Google Calendar
let googleCalendarConfig = {
  clientId: '',
  apiKey: '',
  conectado: false
};

// ============================================
// SISTEMA DE LOGIN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Carrega dados salvos
  carregarDados();
  
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Validação simples (em produção, use autenticação real)
      if (username === 'admin' && password === 'admin123') {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
        document.getElementById('adminName').textContent = username;
        
        // Carrega dados iniciais
        carregarProdutosAdmin();
        gerarCalendarioAdmin();
        
        mostrarAlerta('✅ Login realizado com sucesso!', 'sucesso');
      } else {
        mostrarAlerta('❌ Usuário ou senha incorretos!', 'erro');
      }
    });
  }

  // Form Produto
  const formProduto = document.getElementById('formProduto');
  if (formProduto) {
    formProduto.addEventListener('submit', function(e) {
      e.preventDefault();
      salvarProduto();
    });
  }
});

function logout() {
  document.getElementById('adminContainer').style.display = 'none';
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  mostrarAlerta('👋 Logout realizado com sucesso!', 'info');
}

// ============================================
// NAVEGAÇÃO ENTRE TABS
// ============================================
function showTab(tabName) {
  // Remove active de todas as tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Ativa a tab selecionada
  event.target.classList.add('active');
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Carrega conteúdo específico
  if (tabName === 'agendamentos') {
    gerarCalendarioAdmin();
  }
}

// ============================================
// GESTÃO DE PRODUTOS
// ============================================
function carregarDados() {
  // Carrega produtos salvos
  const produtosSalvos = localStorage.getItem('produtosAdmin');
  if (produtosSalvos) {
    produtosAdmin = JSON.parse(produtosSalvos);
  } else {
    // Produtos iniciais
    produtosAdmin = [
      {
        id: 1,
        nome: 'Ração Premium Cães Adultos',
        descricao: 'Ração super premium 15kg para cães adultos',
        preco: 189.90,
        emoji: '🦴',
        categoria: 'racao',
        ativo: true
      },
      {
        id: 2,
        nome: 'Ração Premium Gatos',
        descricao: 'Ração super premium 10kg para gatos adultos',
        preco: 159.90,
        emoji: '🐱',
        categoria: 'racao',
        ativo: true
      },
      {
        id: 3,
        nome: 'Brinquedo Interativo',
        descricao: 'Brinquedo educativo com dispenser de petiscos',
        preco: 45.90,
        emoji: '🎾',
        categoria: 'brinquedos',
        ativo: true
      },
      {
        id: 4,
        nome: 'Cama Confort Plus',
        descricao: 'Cama ortopédica tamanho médio',
        preco: 129.90,
        emoji: '🛏️',
        categoria: 'camas',
        ativo: true
      }
    ];
    salvarDados();
  }
  
  // Carrega agendamentos salvos
  const agendamentosSalvos = localStorage.getItem('agendamentosAdmin');
  if (agendamentosSalvos) {
    agendamentosAdmin = JSON.parse(agendamentosSalvos);
  } else {
    // Agendamentos exemplo
    const hoje = new Date();
    agendamentosAdmin = [
      {
        id: 1,
        data: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`,
        horario: '09:00',
        tutor: 'Maria Silva',
        pet: 'Rex',
        servico: 'Banho & Tosa',
        telefone: '(62) 98888-8888',
        observacoes: 'Cachorro grande, raça Golden'
      },
      {
        id: 2,
        data: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`,
        horario: '14:00',
        tutor: 'João Santos',
        pet: 'Mimi',
        servico: 'Consulta Veterinária',
        telefone: '(62) 99999-9999',
        observacoes: 'Gato com tosse'
      }
    ];
    salvarDados();
  }
  
  // Carrega configurações do Google Calendar
  const googleConfig = localStorage.getItem('googleCalendarConfig');
  if (googleConfig) {
    googleCalendarConfig = JSON.parse(googleConfig);
  }
}

function salvarDados() {
  localStorage.setItem('produtosAdmin', JSON.stringify(produtosAdmin));
  localStorage.setItem('agendamentosAdmin', JSON.stringify(agendamentosAdmin));
  localStorage.setItem('googleCalendarConfig', JSON.stringify(googleCalendarConfig));
}

function carregarProdutosAdmin() {
  const grid = document.getElementById('produtosGrid');
  grid.innerHTML = '';
  
  if (produtosAdmin.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">Nenhum produto cadastrado</p>';
    return;
  }
  
  produtosAdmin.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <div class="produto-emoji">${produto.emoji}</div>
      <div class="produto-nome">${produto.nome}</div>
      <div class="produto-descricao">${produto.descricao}</div>
      <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
      <span class="produto-status ${produto.ativo ? 'ativo' : 'inativo'}">
        ${produto.ativo ? '✓ Ativo' : '✕ Inativo'}
      </span>
      <div class="produto-actions">
        <button class="btn-edit" onclick="editarProduto(${produto.id})">
          Editar
        </button>
        <button class="btn-delete" onclick="excluirProduto(${produto.id})">
          Excluir
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function abrirModalProduto() {
  produtoEditando = null;
  document.getElementById('modalTitle').textContent = 'Adicionar Produto';
  document.getElementById('formProduto').reset();
  document.getElementById('produtoId').value = '';
  document.getElementById('produtoAtivo').checked = true;
  document.getElementById('modalProduto').style.display = 'flex';
}

function fecharModalProduto() {
  document.getElementById('modalProduto').style.display = 'none';
  produtoEditando = null;
}

function editarProduto(id) {
  const produto = produtosAdmin.find(p => p.id === id);
  if (!produto) return;
  
  produtoEditando = produto;
  document.getElementById('modalTitle').textContent = 'Editar Produto';
  document.getElementById('produtoId').value = produto.id;
  document.getElementById('produtoEmoji').value = produto.emoji;
  document.getElementById('produtoNome').value = produto.nome;
  document.getElementById('produtoDescricao').value = produto.descricao;
  document.getElementById('produtoPreco').value = produto.preco;
  document.getElementById('produtoCategoria').value = produto.categoria;
  document.getElementById('produtoAtivo').checked = produto.ativo;
  
  document.getElementById('modalProduto').style.display = 'flex';
}

function salvarProduto() {
  const id = document.getElementById('produtoId').value;
  const emoji = document.getElementById('produtoEmoji').value.trim();
  const nome = document.getElementById('produtoNome').value.trim();
  const descricao = document.getElementById('produtoDescricao').value.trim();
  const preco = parseFloat(document.getElementById('produtoPreco').value);
  const categoria = document.getElementById('produtoCategoria').value;
  const ativo = document.getElementById('produtoAtivo').checked;
  
  if (!emoji || !nome || !descricao || isNaN(preco)) {
    mostrarAlerta('❌ Preencha todos os campos obrigatórios!', 'erro');
    return;
  }
  
  if (id) {
    // Editar produto existente
    const index = produtosAdmin.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      produtosAdmin[index] = {
        ...produtosAdmin[index],
        emoji,
        nome,
        descricao,
        preco,
        categoria,
        ativo
      };
      mostrarAlerta('✅ Produto atualizado com sucesso!', 'sucesso');
    }
  } else {
    // Novo produto
    const novoId = produtosAdmin.length > 0 
      ? Math.max(...produtosAdmin.map(p => p.id)) + 1 
      : 1;
    
    produtosAdmin.push({
      id: novoId,
      emoji,
      nome,
      descricao,
      preco,
      categoria,
      ativo
    });
    
    mostrarAlerta('✅ Produto adicionado com sucesso!', 'sucesso');
  }
  
  salvarDados();
  carregarProdutosAdmin();
  fecharModalProduto();
}

function excluirProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) {
    return;
  }
  
  produtosAdmin = produtosAdmin.filter(p => p.id !== id);
  salvarDados();
  carregarProdutosAdmin();
  mostrarAlerta('🗑️ Produto excluído com sucesso!', 'info');
}

// ============================================
// GESTÃO DE AGENDAMENTOS
// ============================================
function gerarCalendarioAdmin() {
  const mesAnoEl = document.getElementById('mesAnoAdmin');
  const diasEl = document.getElementById('diasCalendarioAdmin');
  
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  mesAnoEl.textContent = `${meses[mesAtualAdmin]} ${anoAtualAdmin}`;
  
  const primeiroDia = new Date(anoAtualAdmin, mesAtualAdmin, 1).getDay();
  const ultimoDia = new Date(anoAtualAdmin, mesAtualAdmin + 1, 0).getDate();
  const ultimoDiaMesAnterior = new Date(anoAtualAdmin, mesAtualAdmin, 0).getDate();
  
  diasEl.innerHTML = '';
  
  // Dias do mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    const dia = ultimoDiaMesAnterior - i;
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia outro-mes';
    diaDiv.innerHTML = `<span class="dia-numero">${dia}</span>`;
    diasEl.appendChild(diaDiv);
  }
  
  // Dias do mês atual
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia';
    
    const dataStr = `${anoAtualAdmin}-${String(mesAtualAdmin + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const agendamentosDoDia = agendamentosAdmin.filter(a => a.data === dataStr);
    
    if (agendamentosDoDia.length > 0) {
      diaDiv.classList.add('tem-agendamento');
      diaDiv.innerHTML = `
        <span class="dia-numero">${dia}</span>
        <span class="dia-count">${agendamentosDoDia.length}</span>
      `;
    } else {
      diaDiv.innerHTML = `<span class="dia-numero">${dia}</span>`;
    }
    
    diaDiv.onclick = () => selecionarDiaAdmin(dia, dataStr, diaDiv);
    
    diasEl.appendChild(diaDiv);
  }
  
  // Completa com dias do próximo mês
  const diasRestantes = 42 - diasEl.children.length;
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia outro-mes';
    diaDiv.innerHTML = `<span class="dia-numero">${dia}</span>`;
    diasEl.appendChild(diaDiv);
  }
}

function mudarMesAdmin(direcao) {
  mesAtualAdmin += direcao;
  
  if (mesAtualAdmin > 11) {
    mesAtualAdmin = 0;
    anoAtualAdmin++;
  } else if (mesAtualAdmin < 0) {
    mesAtualAdmin = 11;
    anoAtualAdmin--;
  }
  
  diaSelecionadoAdmin = null;
  gerarCalendarioAdmin();
  document.getElementById('agendamentosDetalhes').innerHTML = 
    '<p style="text-align: center; color: #999;">Selecione um dia para ver os agendamentos</p>';
}

function selecionarDiaAdmin(dia, dataStr, elemento) {
  // Remove seleção anterior
  document.querySelectorAll('.dia.selecionado').forEach(el => {
    el.classList.remove('selecionado');
  });
  
  // Adiciona nova seleção
  elemento.classList.add('selecionado');
  diaSelecionadoAdmin = dataStr;
  
  exibirAgendamentosDoDia(dataStr);
}

function exibirAgendamentosDoDia(dataStr) {
  const container = document.getElementById('agendamentosDetalhes');
  const agendamentosDoDia = agendamentosAdmin.filter(a => a.data === dataStr);
  
  if (agendamentosDoDia.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum agendamento para este dia</p>';
    return;
  }
  
  container.innerHTML = '';
  
  agendamentosDoDia.sort((a, b) => a.horario.localeCompare(b.horario));
  
  agendamentosDoDia.forEach(agendamento => {
    const item = document.createElement('div');
    item.className = 'agendamento-item';
    item.innerHTML = `
      <div class="agendamento-horario">🕐 ${agendamento.horario}</div>
      <div class="agendamento-cliente">👤 ${agendamento.tutor} | 🐾 ${agendamento.pet}</div>
      <div class="agendamento-servico">🛠️ ${agendamento.servico}</div>
    `;
    item.onclick = () => exibirDetalhesAgendamento(agendamento);
    container.appendChild(item);
  });
}

function exibirDetalhesAgendamento(agendamento) {
  const modal = document.getElementById('modalAgendamento');
  const detalhes = document.getElementById('agendamentoDetalhes');
  
  const dataFormatada = new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR');
  
  detalhes.innerHTML = `
    <div class="agendamento-detalhes">
      <div class="detalhe-item">
        <div class="detalhe-label">📅 Data</div>
        <div class="detalhe-valor">${dataFormatada}</div>
      </div>
      <div class="detalhe-item">
        <div class="detalhe-label">🕐 Horário</div>
        <div class="detalhe-valor">${agendamento.horario}</div>
      </div>
      <div class="detalhe-item">
        <div class="detalhe-label">👤 Tutor</div>
        <div class="detalhe-valor">${agendamento.tutor}</div>
      </div>
      <div class="detalhe-item">
        <div class="detalhe-label">🐾 Pet</div>
        <div class="detalhe-valor">${agendamento.pet}</div>
      </div>
      <div class="detalhe-item">
        <div class="detalhe-label">🛠️ Serviço</div>
        <div class="detalhe-valor">${agendamento.servico}</div>
      </div>
      <div class="detalhe-item">
        <div class="detalhe-label">📱 Telefone</div>
        <div class="detalhe-valor">${agendamento.telefone}</div>
      </div>
      ${agendamento.observacoes ? `
        <div class="detalhe-item">
          <div class="detalhe-label">📝 Observações</div>
          <div class="detalhe-valor">${agendamento.observacoes}</div>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.style.display = 'flex';
}

function fecharModalAgendamento() {
  document.getElementById('modalAgendamento').style.display = 'none';
}

function exportarAgendamentos() {
  const dataStr = JSON.stringify(agendamentosAdmin, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `agendamentos-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  mostrarAlerta('✅ Agendamentos exportados com sucesso!', 'sucesso');
}

// ============================================
// INTEGRAÇÕES
// ============================================
function salvarConfigGoogle() {
  const clientId = document.getElementById('googleClientId').value.trim();
  const apiKey = document.getElementById('googleApiKey').value.trim();
  
  if (!clientId || !apiKey) {
    mostrarAlerta('❌ Preencha ambos os campos!', 'erro');
    return;
  }
  
  googleCalendarConfig.clientId = clientId;
  googleCalendarConfig.apiKey = apiKey;
  
  salvarDados();
  mostrarAlerta('✅ Configurações salvas com sucesso!', 'sucesso');
}

function conectarGoogleCalendar() {
  if (!googleCalendarConfig.clientId || !googleCalendarConfig.apiKey) {
    mostrarAlerta('❌ Configure as credenciais do Google primeiro!', 'erro');
    return;
  }
  
  mostrarAlerta('🔄 Conectando ao Google Calendar...', 'info');
  
  // Simulação de conexão (em produção, usar a API real do Google)
  setTimeout(() => {
    googleCalendarConfig.conectado = true;
    salvarDados();
    
    const statusEl = document.getElementById('googleStatus');
    statusEl.innerHTML = '<span class="status-badge conectado">Conectado</span>';
    
    mostrarAlerta('✅ Conectado ao Google Calendar com sucesso!', 'sucesso');
  }, 2000);
}

function sincronizarGoogle() {
  if (!googleCalendarConfig.conectado) {
    mostrarAlerta('❌ Conecte-se ao Google Calendar primeiro!', 'erro');
    return;
  }
  
  mostrarAlerta('🔄 Sincronizando agendamentos...', 'info');
  
  // Simulação de sincronização (em produção, usar a API real)
  setTimeout(() => {
    mostrarAlerta('✅ Agendamentos sincronizados com sucesso!', 'sucesso');
  }, 2000);
}

function conectarMercadoPago() {
  mostrarAlerta('🔄 Redirecionando para autenticação do Mercado Pago...', 'info');
  // Em produção, redirecionar para OAuth do Mercado Pago
}

function conectarEmail() {
  mostrarAlerta('🔄 Configurando integração de email...', 'info');
  // Em produção, configurar SMTP ou serviço de email
}

// ============================================
// SISTEMA DE ALERTAS
// ============================================
function mostrarAlerta(mensagem, tipo) {
  const alertaExistente = document.getElementById('alerta-customizado');
  if (alertaExistente) {
    alertaExistente.remove();
  }
  
  const cores = {
    sucesso: { bg: '#4caf50', texto: '#fff' },
    erro: { bg: '#f44336', texto: '#fff' },
    info: { bg: '#2196f3', texto: '#fff' }
  };
  
  const cor = cores[tipo] || cores.info;
  
  const alerta = document.createElement('div');
  alerta.id = 'alerta-customizado';
  alerta.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: ${cor.bg}; color: ${cor.texto}; 
                padding: 20px; border-radius: 10px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                max-width: 350px; animation: slideIn 0.3s ease;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <span style="white-space: pre-line;">${mensagem}</span>
        <button onclick="this.closest('#alerta-customizado').remove()" 
                style="background: none; border: none; color: ${cor.texto}; 
                       font-size: 18px; cursor: pointer; margin-left: 10px;">✕</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(alerta);
  
  setTimeout(() => {
    if (document.getElementById('alerta-customizado')) {
      document.getElementById('alerta-customizado').remove();
    }
  }, 5000);
}

// Adiciona animação CSS
if (!document.getElementById('animacao-alerta')) {
  const style = document.createElement('style');
  style.id = 'animacao-alerta';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}