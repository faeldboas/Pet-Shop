<?php
// connect.php
// Configurações do seu banco de dados
$conn = new mysqli('localhost', 'root', '', 'petshop'); 

if ($conn -> connect_error) {
    // Retorna erro se a conexão falhar
    die("Conexão falhou: " . $conn -> connect_error);
};

/**
 * Insere um novo agendamento no banco de dados usando Prepared Statements.
 * Colunas na tabela 'agenda': nome, email, numero, tipo, detalhes, data_agendamento, horario_agendamento
 */
function insert_agendamento($nome, $email, $telefone, $servico, $mensagem, $data, $horario) {
    global $conn; 

    // 1. Prepara a instrução SQL com placeholders
    $sql = "INSERT INTO agenda (nome, email, numero, tipo, detalhes, data_agendamento, horario_agendamento) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    // 2. Prepara a instrução
    if ($stmt = $conn->prepare($sql)) {
        // 3. Associa os 7 parâmetros como string (sssssss)
        $stmt->bind_param("sssssss", $nome, $email, $telefone, $servico, $mensagem, $data, $horario);
        
        // 4. Executa a instrução
        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            error_log("Erro na execução do INSERT: " . $stmt->error);
            $stmt->close();
            return false;
        }
    } else {
        error_log("Erro na preparação do statement: " . $conn->error);
        return false;
    }
}
?>