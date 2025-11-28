<?php
// processar_agendamento.php

require 'connect.php'; 
header('Content-Type: application/json; charset=utf-8');

// O HTML/JS não coleta email, então usamos um placeholder, mas ele é necessário na função de insert (7 campos)
$email = 'nao_informado@petshop.com'; 

// 1. Coleta e sanitiza TODOS os 6 dados de POST enviados pelo JS
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
$telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_SPECIAL_CHARS);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_SPECIAL_CHARS); // Pet + Observações
$servico = filter_input(INPUT_POST, 'servico', FILTER_SANITIZE_SPECIAL_CHARS); 
$data = filter_input(INPUT_POST, 'data', FILTER_SANITIZE_SPECIAL_CHARS); 
$horario = filter_input(INPUT_POST, 'horario', FILTER_SANITIZE_SPECIAL_CHARS); 

// 2. Validação básica (incluindo data e horário)
if (!$nome || !$telefone || !$servico || !$data || !$horario) {
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (Nome, Telefone, Serviço, Data, Horário) incompletos.']);
    exit;
}

// 3. Chama a função de INSERT, passando os 7 campos (incluindo o email placeholder):
// insert_agendamento($nome, $email, $telefone, $servico, $mensagem, $data, $horario)
if (insert_agendamento($nome, $email, $telefone, $servico, $mensagem, $data, $horario)) {
    echo json_encode(['success' => true, 'message' => 'Agendamento inserido com sucesso!']);
} else {
    // O erro será logado no servidor, mas aqui retornamos uma mensagem genérica de falha
    echo json_encode(['success' => false, 'message' => 'Falha interna ao salvar agendamento no banco de dados.']);
}

$conn->close();
?>