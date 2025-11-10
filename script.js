// arquivo: script.js
console.log('Script carregado com sucesso!');
document.addEventListener('DOMContentLoaded', function () {

    // Aguarda o formulário estar carregado
    const formulario = document.getElementById('formulario-contato');

    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            // Impede o envio normal do formulário
            e.preventDefault();

            // Pega os valores digitados
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const servico = document.getElementById('servico').value;
            const mensagem = document.getElementById('mensagem').value.trim();

            // Validação básica
            if (!nome || !email || !servico || !mensagem) {
                mostrarAlerta('Por favor, preencha todos os campos obrigatórios!', 'erro');
                return;
            }

            // Monta a mensagem do WhatsApp
            let textoWhatsApp = '*🐾 NOVA MENSAGEM DO SITE OSVALDO PETSHOP*%0A%0A';
            textoWhatsApp += `*👤 Nome:* ${nome}%0A`;
            textoWhatsApp += `*📧 E-mail:* ${email}%0A`;

            if (telefone) {
                textoWhatsApp += `*📱 Telefone:* ${telefone}%0A`;
            }

            textoWhatsApp += `*🛍️ Serviço:* ${servico}%0A`;
            textoWhatsApp += `*💬 Mensagem:* ${mensagem}%0A%0A`;
            textoWhatsApp += `_Mensagem enviada via site oficial_ ✅`;


            const numeroWhatsApp = '5562984580527';

            // Cria o link do WhatsApp
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}`;

            // Abre o WhatsApp
            window.open(linkWhatsApp, '_blank');

            // Limpa o formulário
            formulario.reset();

            // Mensagem de confirmação
            mostrarAlerta('✅ Redirecionando para o WhatsApp!\n\nSua mensagem será enviada automaticamente.', 'sucesso');
        });
    }

    // Função para mostrar alertas personalizados
    function mostrarAlerta(mensagem, tipo) {
        // Remove alerta anterior se existir
        const alertaExistente = document.getElementById('alerta-customizado');
        if (alertaExistente) {
            alertaExistente.remove();
        }

        // Cores baseadas no tipo
        const cores = {
            sucesso: { bg: '#4caf50', texto: '#fff' },
            erro: { bg: '#f44336', texto: '#fff' },
            info: { bg: '#2196f3', texto: '#fff' }
        };

        const cor = cores[tipo] || cores.info;

        // Cria o alerta
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
                                   font-size: 18px; cursor: pointer; margin-left: 10px;"></button>
                </div>
            </div>
        `;

        document.body.appendChild(alerta);

        // Remove automaticamente após 5 segundos
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
});