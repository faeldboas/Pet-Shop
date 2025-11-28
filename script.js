console.log('Script carregado com sucesso!');

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
// Armazena a data selecionada como um objeto Date para melhor controle
let dataSelecionada = null; 
let horarioSelecionado = null;
let produtosLoja = [];
let carrinho = [];

// ============================================
// FUNÇÕES DE PRODUTOS (Carregamento e Exibição)
// ============================================

async function carregarProdutos() {
    try {
        // Tenta carregar do PHP. Caminho: 'php/get_produtos.php'
        const response = await fetch('php/get_produtos.php');

        if (!response.ok) {
            console.error(`❌ Erro HTTP! Status: ${response.status}. Verifique o caminho 'php/get_produtos.php'.`);
            throw new Error('Erro ao carregar produtos do servidor.');
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.produtos)) {
            produtosLoja = data.produtos;
            console.log(`✅ Produtos carregados do MySQL: ${produtosLoja.length}`);
        } else {
            console.warn('Resposta do PHP inválida ou sem produtos.');
        }

    } catch (error) {
        console.error('❌ Erro ao carregar produtos. Exibindo lista vazia.', error);
    }

    renderizarProdutos();
    adicionarListenersProdutos();
}

function renderizarProdutos() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    container.innerHTML = '';

    // Definição das cores baseadas no Painel Admin (para uso inline)
    const colorPetrol = '#006064';      // Azul Petróleo principal
    const colorPetrolDark = '#004d40';  // Petróleo mais escuro (para hover, se for implementado)
    const colorLightGray = '#f5f5f5';  // Cinza claro de fundo/botões
    const colorTextDark = '#333333';   // Texto escuro
    const colorPriceHighlight = '#e91e63'; // Destaque para o preço (magenta)

    if (produtosLoja.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1; padding: 40px;">Nenhum produto disponível no momento.</p>';
        return;
    }

    produtosLoja.forEach(produto => {
        const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
        const produtoDiv = document.createElement('div');
        
        // Estilo inline para o CARD (Container principal)
        produtoDiv.className = 'product-card'; 
        produtoDiv.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease; /* Mantém a transição para possível hover via CSS externo */
        `;

        produtoDiv.innerHTML = `
            <div class="product-image-container" style="height: 150px; margin-bottom: 15px; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <img src="assets/produtos/${produto.img}" alt="${produto.nome}" class="product-img" 
                     style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 8px;">
            </div>
            
            <h3 style="color: ${colorPetrol}; font-size: 1.4rem; margin-bottom: 5px;">${produto.nome}</h3>
            <p class="product-category" style="color: #999; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">${produto.category}</p>
            <p class="product-description" style="color: ${colorTextDark}; font-size: 0.95rem; margin-bottom: 15px; flex-grow: 1;">${produto.description}</p>
            <div class="product-price" style="font-size: 1.6rem; color: ${colorPriceHighlight}; font-weight: bold; margin-bottom: 15px;">R$ ${precoFormatado}</div>

            <div class="product-actions" style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: auto;">
                
                <div class="quantity-selector" style="display: flex; align-items: center; border: none; border-radius: 6px; overflow: visible; width: 120px;">
                    
                    <button class="quantity-btn decrease-btn" data-action="decrease" 
                            style="background: ${colorLightGray}; color: ${colorTextDark}; border: none; padding: 8px 12px; cursor: pointer; font-size: 1.1rem; transition: background 0.2s; border-radius: 6px 0 0 6px;">-</button>
                    
                    <input type="number" class="quantity-input" value="1" min="1" data-product-id="${produto.id}" readonly 
                           style="width: 40px; text-align: center; border: none; font-size: 1rem; padding: 8px 0; outline: none;">
                           
                    <button class="quantity-btn increase-btn" data-action="increase" 
                            style="background: ${colorLightGray}; color: ${colorTextDark}; border: none; padding: 8px 12px; cursor: pointer; font-size: 1.1rem; transition: background 0.2s; border-radius: 0 6px 6px 0;">+</button>
                </div>
                
                <div class="add-to-cart-btn" data-product-name="${produto.nome}"
                    style="width: 100%; padding: 10px 15px; border-radius: 6px; font-weight: bold; text-align: center; cursor: pointer; text-decoration: none; box-sizing: border-box; background-color: ${colorPetrol}; color: white; transition: background 0.3s ease;">
                    Adicionar ao Carrinho
                </div>
            </div>
        `;
        container.appendChild(produtoDiv);
    });
}

function adicionarListenersProdutos() {
    // 1. Listeners para os botões de QUANTIDADE (+ e -)
    document.querySelectorAll('.quantity-btn').forEach(button => {
        if (button.hasAttribute('data-listener-added')) return;

        button.addEventListener('click', function () {
            const card = this.closest('.product-card');
            const input = card.querySelector('.quantity-input');
            let currentValue = parseInt(input.value) || 1;

            if (this.classList.contains('increase-btn')) {
                currentValue++;
            } else if (this.classList.contains('decrease-btn')) {
                currentValue = Math.max(1, currentValue - 1);
            }
            input.value = currentValue;
        });
        button.setAttribute('data-listener-added', 'true');
    });
}


// ============================================
// SISTEMA DE CALENDÁRIO (CORRIGIDO)
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

    // Marca o dia selecionado se houver
    if (dataSelecionada && dataSelecionada.getDate() === dia && dataSelecionada.getMonth() === mesAtual && dataSelecionada.getFullYear() === anoAtual) {
         diaDiv.classList.add('selecionado');
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
  dataSelecionada = null; // Limpa a data completa
  horarioSelecionado = null;
  
  const horariosSection = document.getElementById('horariosSection');
  const formAgendamento = document.getElementById('formulario-agendamento');
  
  if (horariosSection) horariosSection.style.display = 'none';
  if (formAgendamento) formAgendamento.style.display = 'none';
  
  const dadosSelecionados = document.getElementById('dadosSelecionados');
  if (dadosSelecionados) dadosSelecionados.innerHTML = '';


  gerarCalendario();
}

function selecionarDia(dia, elemento) {
  // Remove seleção anterior
  document.querySelectorAll('.dia.selecionado').forEach(el => {
    el.classList.remove('selecionado');
  });

  // Adiciona nova seleção
  elemento.classList.add('selecionado');
  
  // CORREÇÃO ESSENCIAL: Armazena a data completa (Date Object)
  dataSelecionada = new Date(anoAtual, mesAtual, dia);
  
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
    
    // CORREÇÃO: Usa dataSelecionada para formatar a data de exibição
    const dataExibicao = dataSelecionada ? `${dataSelecionada.getDate()} de ${meses[dataSelecionada.getMonth()]} de ${dataSelecionada.getFullYear()}` : 'Não selecionada';
    
    const dadosSelecionados = document.getElementById('dadosSelecionados');
    if (dadosSelecionados) {
      dadosSelecionados.innerHTML = `
        <p>📅 Data: ${dataExibicao}</p>
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
// FUNÇÃO DE ENVIO PARA O BACKEND PHP (DB)
// ============================================
async function enviarAgendamentoParaPHP(nomeTutor, nomePet, telefone, servico, observacoes, data, horario) {
    const formData = new FormData();

    // O backend espera 6 dados do form + 1 (email placeholder)
    // Os nomes das chaves (nome, telefone, servico, mensagem, data, horario) devem bater com o PHP
    formData.append('nome', nomeTutor);
    formData.append('telefone', telefone);
    formData.append('servico', servico);
    formData.append('mensagem', `Pet: ${nomePet}. Observações: ${observacoes}`); // União Pet + Obs
    formData.append('data', data);
    formData.append('horario', horario);

    try {
        // Caminho relativo correto
        const caminhoPHP = 'php/processar_agendamento.php';

        const response = await fetch(caminhoPHP, {
            method: 'POST',
            body: formData
        });

        // Tenta ler o JSON, mas se falhar, tenta ler o texto para debug
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro HTTP ${response.status}. Resposta do servidor: ${errorText}`);
            throw new Error(`Erro HTTP ${response.status}. Verifique o PHP.`);
        }

        const data = await response.json();

        if (data.success) {
            console.log("✅ Agendamento salvo no MySQL.");
            return true;
        } else {
            console.error("❌ Erro ao agendar no MySQL:", data.message);
            mostrarAlerta(`❌ Falha ao salvar no DB: ${data.message}. Verifique a conexão com o banco de dados.`, 'erro');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro de comunicação ou JSON inválido. Verifique o XAMPP e o caminho.', error);
        mostrarAlerta(`❌ Erro de comunicação com o servidor! Verifique se o XAMPP está ligado e se processar_agendamento.php está na pasta 'php'.`, 'erro');
        return false;
    }
}


// ============================================
// ENVIO DO FORMULÁRIO DE AGENDAMENTO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos();
    gerarCalendario();

    const formAgendamento = document.getElementById('formulario-agendamento');

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async function (e) {
            e.preventDefault();

            // dataSelecionada (Objeto Date) agora é checada aqui
            if (!dataSelecionada || !horarioSelecionado) { 
                mostrarAlerta('❌ Por favor, selecione uma data e horário!', 'erro');
                return;
            }

            // 1. Coletar dados do formulário
            const nomeTutor = document.getElementById('nomeTutor').value.trim();
            const nomePet = document.getElementById('nomePet').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const servico = document.getElementById('servico').value;
            const observacoes = document.getElementById('observacoes').value.trim();

            if (!nomeTutor || !nomePet || !telefone || !servico) {
                mostrarAlerta('❌ Por favor, preencha todos os campos obrigatórios!', 'erro');
                return;
            }

            // 2. Formatar Data (formato YYYY-MM-DD para o DB) - SÓ FUNCIONA COM dataSelecionada sendo um objeto Date
            const dataFormatada = `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}-${String(dataSelecionada.getDate()).padStart(2, '0')}`;

            // 3. Enviar para o PHP (DB)
            const sucessoBD = await enviarAgendamentoParaPHP(
                nomeTutor, nomePet, telefone, servico, observacoes, dataFormatada, horarioSelecionado
            );

            // 4. Processa o resultado do banco de dados
            if (sucessoBD) {
                mostrarAlerta('✅ Agendamento salvo com sucesso no sistema! Você pode fechar esta página ou agendar outro horário.', 'sucesso');

                // 5. Limpa e reseta o formulário
                formAgendamento.reset();

                // Reseta variáveis globais e UI
                dataSelecionada = null;
                horarioSelecionado = null;

                document.querySelectorAll('.dia.selecionado, .horario.selecionado').forEach(el => {
                    el.classList.remove('selecionado');
                });

                const horariosSection = document.getElementById('horariosSection');
                const dadosSelecionados = document.getElementById('dadosSelecionados');

                if (horariosSection) horariosSection.style.display = 'none';
                if (formAgendamento) formAgendamento.style.display = 'none';
                if (dadosSelecionados) dadosSelecionados.innerHTML = '';

                gerarCalendario(); // Regenera o calendário

            }
        });
    }
});


// ============================================
// SISTEMA DE ALERTAS E SCROLL SUAVE (AJAX)
// ============================================
function mostrarAlerta(mensagem, tipo) {
    // ... (Código da função mostrarAlerta permanece o mesmo) ...
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
// Adiciona animação CSS se ainda não existir
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

// Scroll suave para âncoras
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