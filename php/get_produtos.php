<?php
// get_produtos.php

require 'connect.php'; 

header('Content-Type: application/json; charset=utf-8');

// A query usa as colunas conforme sua tabela: id, nome, preco, img, category, description
$sql = "SELECT id, nome, preco, img, category, description FROM produtos";
$result = $conn->query($sql);

$produtos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Assegura que o preço seja um float para o JavaScript
        $row['preco'] = (float) $row['preco']; 
        
        $produtos[] = $row;
    }
    // Retorna sucesso e a lista de produtos
    echo json_encode(['success' => true, 'produtos' => $produtos]);
} else {
    // Retorna sucesso, mas com a lista vazia se não houver produtos
    echo json_encode(['success' => true, 'produtos' => []]);
}

$conn->close();
?>