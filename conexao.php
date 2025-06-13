<?php
$host = 'localhost';
$db = 'sistema_login';
$user = 'root';  // ou o seu usuário do MySQL
$pass = '';      // coloque a senha se houver

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão: " . $e->getMessage());
}
?>
