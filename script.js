console.log('Script carregado com sucesso!');

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let diaSelecionado = null;
let horarioSelecionado = null;
let produtosLoja = [];

// API Client (se estiver usando backend)
const api = typeof APIClient !== 'undefined' ? new APIClient() : null;

// ============================================
// CARREGA PRODUTOS (DO BACKEND OU PADRÃO)
// ============================================
async function carregarProdutos() {
  try {
    if (api) {
      // Tenta carregar do backend
      produtosLoja = await api.getProdutos(true); // apenas ativos
      console.log('✅ Produtos carregados da API:', produtosLoja.length);
    } else {
      // Usa produtos padrão
      usarProdutosPadrao();
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    usarProdutosPadrao();
  }
  
  renderizarProdutos();
}

function usarProdutosPadrao() {
  produtosLoja = [
    {
      id: 1,
      nome: 'Ração Premium Cães Adultos',
      descricao: 'Ração super premium 15kg para cães adultos',
      preco: 189.90,
      emoji: '🦴'
    },
    {
      id: 2,
      nome: 'Ração Premium Gatos',
      descricao: 'Ração super premium 10kg para gatos adultos',
      preco: 159.90,
      emoji: '🐱'
    },
    {
      id: 3,
      nome: 'Brinquedo Interativo',
      descricao: 'Brinquedo educativo com dispenser de petiscos',
      preco: 45.90,
      emoji: '🎾'
    },
    {
      id: 4,
      nome: 'Cama Confort Plus',
      descricao: 'Cama ortopédica tamanho médio',
      preco: 129.90,
      emoji: '🛏️'
    },
    {
      id: 5,
      nome: 'Coleira Premium',
      descricao: 'Coleira ajustável com guia retrátil',
      preco: 79.90,
      emoji: '🎀'
    },
    {
      id: 6,
      nome: 'Casinha Impermeável',
      descricao: 'Casinha plástica para médio porte',
      preco: 249.90,
      emoji: '🏠'
    }
  ];
  console.log('⚠️ Usando produtos padrão');
}

function renderizarProdutos() {
  const container = document.getElementById('products-grid');
  
  if (!container) return;
  
  container.innerHTML = '';

  if (produtosLoja.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1; padding: 40px;">Nenhum produto disponível no momento.</p>';
    return;
  }

  produtosLoja.forEach(produto => {
    const produtoDiv = document.createElement('div');
    produtoDiv.className = 'product-card';
    produtoDiv.innerHTML = `
      <div class="product-icon">${produto.emoji}</div>
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
      <a href="https://wa.me/5562984580527?text=Olá! Tenho interesse no produto: ${encodeURIComponent(produto.nome)}" 
         target="_blank" 
         class="product-btn">
        Comprar via WhatsApp
      </a>
    `;
    container.appendChild(produtoDiv);
  });
}

// ============================================
// SISTEMA DE CALENDÁRIO
// ============================================
function gerarCalendario() {
  const mesAnoEl = document.getElementById('mesAno');
  const diasEl = document.getElementById('diasCalendario');

  if (!mesAnoEl || !diasEl) return;

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  mesAnoEl.textContent = `${meses[mesAtual]} ${anoAtual}`;

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const ultimoDiaMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();

  diasEl.innerHTML = '';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Dias do mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    const dia = ultimoDiaMesAnterior - i;
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia outro-mes';
    diaDiv.textContent = dia;
    diasEl.appendChild(diaDiv);
  }

  // Dias do mês atual
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia';
    diaDiv.textContent = dia;

    const dataDia = new Date(anoAtual, mesAtual, dia);
    dataDia.setHours(0, 0, 0, 0);

    // Desabilita domingos e dias passados
    if (dataDia.getDay() === 0 || dataDia < hoje) {
      diaDiv.classList.add('disabled');
    } else {
      diaDiv.onclick = () => selecionarDia(dia, diaDiv);
    }

    diasEl.appendChild(diaDiv);
  }

  // Completa com dias do próximo mês
  const diasRestantes = 42 - diasEl.children.length;
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia outro-mes';
    diaDiv.textContent = dia;
    diasEl.appendChild(diaDiv);
  }
}

function mudarMes(direcao) {
  mesAtual += direcao;

  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  } else if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }

  // Limpa seleções
  diaSelecionado = null;
  horarioSelecionado = null;
  
  const horariosSection = document.getElementById('horariosSection');
  const formAgendamento = document.getElementById('formulario-agendamento');
  
  if (horariosSection) horariosSection.style.display = 'none';
  if (formAgendamento) formAgendamento.style.display = 'none';

  gerarCalendario();
}

function selecionarDia(dia, elemento) {
  // Remove seleção anterior
  document.querySelectorAll('.dia.selecionado').forEach(el => {
    el.classList.remove('selecionado');
  });

  // Adiciona nova seleção
  elemento.classList.add('selecionado');
  diaSelecionado = dia;
  horarioSelecionado = null;

  gerarHorarios();
}

function gerarHorarios() {
  const horariosSection = document.getElementById('horariosSection');
  const horariosGrid = document.getElementById('horariosGrid');

  if (!horariosSection || !horariosGrid) return;

  horariosSection.style.display = 'block';
  horariosGrid.innerHTML = '';

  // Horários disponíveis (segunda a sábado, 8h às 18h)
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  horarios.forEach(horario => {
    const horarioDiv = document.createElement('div');
    horarioDiv.className = 'horario';
    horarioDiv.textContent = horario;
    horarioDiv.onclick = () => selecionarHorario(horario, horarioDiv);
    horariosGrid.appendChild(horarioDiv);
  });

  const formAgendamento = document.getElementById('formulario-agendamento');
  if (formAgendamento) {
    formAgendamento.style.display = 'none';
  }
}

function selecionarHorario(horario, elemento) {
  // Remove seleção anterior
  document.querySelectorAll('.horario.selecionado').forEach(el => {
    el.classList.remove('selecionado');
  });

  // Adiciona nova seleção
  elemento.classList.add('selecionado');
  horarioSelecionado = horario;

  // Mostra formulário
  const formAgendamento = document.getElementById('formulario-agendamento');
  if (formAgendamento) {
    formAgendamento.style.display = 'flex';
    
    // Exibe dados selecionados
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dadosSelecionados = document.getElementById('dadosSelecionados');
    if (dadosSelecionados) {
      dadosSelecionados.innerHTML = `
        <p>📅 Data: ${diaSelecionado} de ${meses[mesAtual]} de ${anoAtual}</p>
        <p>🕐 Horário: ${horarioSelecionado}</p>
      `;
    }
    
    // Scroll suave até o formulário
    setTimeout(() => {
      formAgendamento.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  }
}

// ============================================
// ENVIO DO FORMULÁRIO DE AGENDAMENTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Carrega produtos ao iniciar
  carregarProdutos();
  
  // Gera calendário
  gerarCalendario();
  
  const formAgendamento = document.getElementById('formulario-agendamento');
  
  if (formAgendamento) {
    formAgendamento.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!diaSelecionado || !horarioSelecionado) {
        mostrarAlerta('❌ Por favor, selecione uma data e horário!', 'erro');
        return;
      }

      const nomeTutor = document.getElementById('nomeTutor').value.trim();
      const nomePet = document.getElementById('nomePet').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const servico = document.getElementById('servico').value;
      const observacoes = document.getElementById('observacoes').value.trim();

      if (!nomeTutor || !nomePet || !telefone || !servico) {
        mostrarAlerta('❌ Por favor, preencha todos os campos obrigatórios!', 'erro');
        return;
      }

      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      // Tenta salvar no backend (se disponível)
      if (api) {
        try {
          const dataFormatada = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(diaSelecionado).padStart(2, '0')}`;
          
          await api.criarAgendamento({
            data: dataFormatada,
            horario: horarioSelecionado,
            tutor: nomeTutor,
            pet: nomePet,
            servico: servico,
            telefone: telefone,
            observacoes: observacoes
          });
          
          console.log('✅ Agendamento salvo no banco de dados');
        } catch (error) {
          console.error('Erro ao salvar agendamento:', error);
          // Continua mesmo se falhar, pois vai enviar por WhatsApp
        }
      }

      // Monta mensagem para WhatsApp
      let mensagem = '*📅 AGENDAMENTO OSVALDO PETSHOP*%0A%0A';
      mensagem += `*📆 Data:* ${diaSelecionado} de ${meses[mesAtual]} de ${anoAtual}%0A`;
      mensagem += `*🕐 Horário:* ${horarioSelecionado}%0A%0A`;
      mensagem += `*👤 Tutor:* ${nomeTutor}%0A`;
      mensagem += `*🐾 Pet:* ${nomePet}%0A`;
      mensagem += `*📱 Telefone:* ${telefone}%0A`;
      mensagem += `*🛠️ Serviço:* ${servico}%0A`;
      
      if (observacoes) {
        mensagem += `*📝 Observações:* ${observacoes}%0A`;
      }
      
      mensagem += `%0A_Agendamento realizado pelo site_ ✅`;

      const numeroWhatsApp = '5562984580527';
      const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

      window.open(linkWhatsApp, '_blank');

      // Limpa formulário
      formAgendamento.reset();
      diaSelecionado = null;
      horarioSelecionado = null;
      
      document.querySelectorAll('.dia.selecionado, .horario.selecionado').forEach(el => {
        el.classList.remove('selecionado');
      });

      const horariosSection = document.getElementById('horariosSection');
      const dadosSelecionados = document.getElementById('dadosSelecionados');
      
      if (horariosSection) horariosSection.style.display = 'none';
      if (formAgendamento) formAgendamento.style.display = 'none';
      if (dadosSelecionados) dadosSelecionados.innerHTML = '';

      mostrarAlerta('✅ Agendamento registrado! Redirecionando para o WhatsApp...', 'sucesso');
    });
  }
});

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

// ============================================
// SCROLL SUAVE PARA ÂNCORAS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

console.log('📊 Status da aplicação:');
console.log('- Produtos carregados:', produtosLoja.length);
console.log('- API disponível:', api ? 'Sim' : 'Não');
console.log('- Sistema pronto!');