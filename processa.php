<?php
session_start();
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'];
    $email = trim($_POST['email']);
    $senha = trim($_POST['senha']);

    if ($acao === 'cadastro') {
        $nome = trim($_POST['nome']);
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO utilizador (nome, email, senha) VALUES (?, ?, ?)");

        try {
            $stmt->execute([$nome, $email, $senha_hash]);
            header("Location: index.php?cadastro=ok");
            exit;
        } catch (PDOException $e) {
            echo "Erro ao cadastrar: " . $e->getMessage();
        }

    } elseif ($acao === 'login') {
        $stmt = $pdo->prepare("SELECT * FROM utilizador WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($senha, $usuario['senha'])) {
            $_SESSION['usuario'] = $usuario;
            header("Location: inicio.html");
            exit;
        } else {
            header("Location: index.php?erro=login");
            exit;
        }
    }
}
?>
