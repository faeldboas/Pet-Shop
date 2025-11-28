-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para petshop
CREATE DATABASE IF NOT EXISTS `petshop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `petshop`;

-- Copiando estrutura para tabela petshop.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` text DEFAULT NULL,
  `senha` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela petshop.admins: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela petshop.agenda
CREATE TABLE IF NOT EXISTS `agenda` (
  `data_agendamento` varchar(50) DEFAULT NULL,
  `horario_agendamento` varchar(50) DEFAULT NULL,
  `nome` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `detalhes` varchar(50) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela petshop.agenda: ~4 rows (aproximadamente)
INSERT INTO `agenda` (`data_agendamento`, `horario_agendamento`, `nome`, `email`, `numero`, `tipo`, `detalhes`, `id`) VALUES
	('2025-11-29', '09:30', 'Vinicius Gabriel Souza Castro Torres', 'nao_informado@petshop.com', '62994984030', 'Banho &#38; Tosa', 'Pet: Lord. Observações: um salsicha', 2),
	('2025-12-05', '13:00', 'Vinicius Gabriel Souza Castro Torres', 'nao_informado@petshop.com', '62994984030', 'Banho &#38; Tosa', 'Pet: Lord. Observações: hbhubyububuy', 3),
	('2025-11-29', '15:00', 'rafael borges rodirvgvues', 'nao_informado@petshop.com', '62994984030', 'Vacinação', 'Pet: sadsa. Observações: ', 4),
	('2025-11-28', '15:00', 'Vinicius Gabriel Souza Castro Torres', 'nao_informado@petshop.com', '62994984030', 'Banho &#38; Tosa', 'Pet: sadsa. Observações: ', 5);

-- Copiando estrutura para tabela petshop.produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela petshop.produtos: ~5 rows (aproximadamente)
INSERT INTO `produtos` (`id`, `nome`, `preco`, `img`, `category`, `description`) VALUES
	(6, 'Ração Premium Cães Adultos 15kg', 189.90, 'racao-caes.png', 'Alimentação', 'Ração Super Premium indicada para cães adultos de médio e grande porte. Alto teor de proteína.'),
	(7, 'Cama Pet Confort Plus G', 149.99, 'cama-pet.png', 'Acessórios', 'Cama macia e ortopédica, ideal para descanso de pets de grande porte. Lavável.'),
	(8, 'Brinquedo Corda Nó Gigante', 35.00, 'corda-brinquedo.png', 'Brinquedos', 'Corda resistente com nós, perfeita para brincadeiras de cabo de guerra e fortalecer a mandíbula.'),
	(9, 'Anti-Pulgas Bravecto 10-20kg', 119.50, 'bravecto.png', 'Medicina', 'Comprimido mastigável com proteção de 12 semanas contra pulgas e carrapatos.'),
	(10, 'Shampoo Neutro Hipoalergênico', 45.90, 'shampoo-neutro.png', 'Higiene', 'Shampoo neutro, sem parabenos, ideal para peles sensíveis. Uso frequente recomendado.');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
