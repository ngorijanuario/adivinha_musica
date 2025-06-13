# adivinha Musíca

## database.sql – Criação da tabela utilizador

```sql
CREATE DATABASE IF NOT EXISTS sistema_login;
USE sistema_login;

CREATE TABLE IF NOT EXISTS utilizador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Conexão com o banco de dados
```php
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
```

## Pagina de processar dados em PHP
```php
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
            header("Location: inicio.php");
            exit;
        } else {
            header("Location: index.php?erro=login");
            exit;
        }
    }
}
?>

```

## Documentação HTML da Página `Login / Cadastro`

```html
<!DOCTYPE html>
```

* Declaração que define o **tipo de documento** como HTML5.

---

```html
<html lang="pt">
```

* Início do documento HTML.
* `lang="pt"` define o idioma como **português**, importante para leitores de tela e SEO.

---

```html
<head>
```

* Contém **metadados** sobre o documento (não visíveis diretamente).

---

```html
    <meta charset="UTF-8">
```

* Define o **conjunto de caracteres** como UTF-8, que suporta acentuação e caracteres especiais.

---

```html
    <title>Login / Cadastro</title>
```

* Define o **título da página** que aparece na aba do navegador.

---

```html
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

* Importa o **Bootstrap CSS** via CDN para estilização rápida e responsiva.

---

```html
</head>
<body class="bg-light">
```

* Início do corpo da página.
* `class="bg-light"` aplica um **fundo claro** usando classe do Bootstrap.

---

```html
<div class="container mt-5">
```

* Um **container centralizado** com margem superior (`mt-5` = "margin top 5").
* Responsável por organizar o conteúdo dentro de uma largura máxima definida.

---

```html
    <div class="row justify-content-center">
```

* Início de uma **linha do grid Bootstrap**.
* `justify-content-center`: alinha as colunas ao centro horizontalmente.

---

### Bloco de Login

```html
        <div class="col-md-5">
```

* Define uma **coluna de 5 unidades** (de 12) em dispositivos médios (ou maiores).

---

```html
            <h2 class="text-center mb-4">Entrar</h2>
```

* Título centralizado com margem inferior (`mb-4` = "margin bottom 4").

---

```html
            <form action="processa.php" method="POST">
```

* Início de um **formulário** que será enviado via método `POST` para o arquivo `processa.php`.

---

```html
                <input type="hidden" name="acao" value="login">
```

* Campo oculto que informa à aplicação que essa requisição é de **login**.

---

```html
                <div class="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
```

* Campo de entrada para o **email**, com validação automática de formato.
* `class="form-control"` aplica estilo padrão do Bootstrap.
* `required` exige preenchimento.

---

```html
                <div class="mb-3">
                    <label>Senha</label>
                    <input type="password" name="senha" class="form-control" required>
                </div>
```

* Campo de **senha** com ocultação dos caracteres.

---

```html
                <button type="submit" class="btn btn-primary w-100">Entrar</button>
```

* Botão de envio do formulário com:

  * `btn btn-primary`: botão azul padrão do Bootstrap.
  * `w-100`: largura total do elemento pai.

---

### 📎 Separador visual

```html
        <div class="col-md-1 d-flex align-items-center justify-content-center">|</div>
```

* Coluna estreita (1/12 da largura).
* Usa Flexbox (`d-flex`) para centralizar vertical e horizontalmente o caractere `|` entre os dois formulários.

---

### Bloco de Cadastro

```html
        <div class="col-md-5">
```

* Outra coluna de 5 unidades para o **formulário de cadastro**.

---

```html
            <h2 class="text-center mb-4">Cadastrar</h2>
```

* Título do formulário de cadastro.

---

```html
            <form action="processa.php" method="POST">
                <input type="hidden" name="acao" value="cadastro">
```

* Formulário enviado para `processa.php`, com o campo oculto `acao=cadastro`.

---

```html
                <div class="mb-3">
                    <label>Nome</label>
                    <input type="text" name="nome" class="form-control" required>
                </div>
```

* Campo de entrada para o **nome do usuário**.

---

```html
                <div class="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
```

* Campo de entrada para o **email**.

---

```html
                <div class="mb-3">
                    <label>Senha</label>
                    <input type="password" name="senha" class="form-control" required>
                </div>
```

* Campo de senha do usuário a ser cadastrado.

---

```html
                <button type="submit" class="btn btn-success w-100">Cadastrar</button>
```

* Botão verde (`btn-success`) para enviar o formulário de cadastro.

---

```html
</body>
</html>
```

* Fim do corpo e do documento HTML.

---

---

## Explicação do JS

### **1. Configuração do Jogo**

```js
const GAME_CONFIG = {
    TOTAL_ROUNDS: 30,
    TIME_PER_ROUND: 30,
    MAX_HINTS: 3,
    HINT_PENALTY: 10,
    BASE_POINTS: 50,
    TIME_BONUS_INTERVAL: 5
};
```

Essas são as configurações básicas:

* `TOTAL_ROUNDS`: quantas rodadas o jogo terá.
* `TIME_PER_ROUND`: tempo (em segundos) por rodada.
* `MAX_HINTS`: número máximo de dicas permitidas.
* `HINT_PENALTY`: desconto de pontos por cada dica usada.
* `BASE_POINTS`: pontos base por resposta correta.
* `TIME_BONUS_INTERVAL`: ganha 1 ponto extra a cada 5 segundos restantes.

---

### **2. Estado do Jogo (`gameState`)**

Armazena o progresso e status atual:

* Rodada atual, tempo restante, modo de jogo, jogadores, áudio, músicas, etc.
* A lista de músicas tem o título, artista, clipe de áudio, opções de dica e ano.
* Variáveis como `currentSong`, `audioBuffer` e `audioSource` controlam a reprodução.

---

### **3. Elementos da Interface (`DOM`)**

Armazena referências aos elementos HTML que o JavaScript vai controlar:

* Botões, campos de texto, cronômetro, informações dos jogadores, modais de resultado, etc.

---

### **4. Inicialização do Jogo**

Função `initGame()`:

* Define o modo de jogo (single/multi).
* Cria os jogadores.
* Ativa os eventos de clique.
* Inicializa o contexto de áudio.
* Começa a primeira rodada.

---

### **5. Modo de Jogo: Single vs Multiplayer**

* `setupSinglePlayer()`: cria apenas 1 jogador.
* `setupMultiplayer()`: cria 4 jogadores simulados e alterna entre eles.

---

### **6. Reprodução da Música**

A música é tocada por 5 segundos, depois o jogador pode digitar a resposta:

```js
setTimeout(() => {
    DOM.musicAudio.pause();
    DOM.answerInput.disabled = false;
    ...
}, 5000);
```

---

### **7. Timer**

O tempo decresce de 30 em 30 segundos. Se chegar a 0, a rodada termina automaticamente:

```js
gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    ...
}, 1000);
```

---

### **8. Verificação da Resposta**

Ao clicar em "Enviar":

* Compara a resposta digitada com o título ou artista da música.
* Se acertar, ganha pontos calculados com base no tempo e nas dicas usadas.

---

### **9. Pontuação**

```js
function calculatePoints() {
    const timeBonus = Math.floor(gameState.timeLeft / GAME_CONFIG.TIME_BONUS_INTERVAL);
    const hintsPenalty = gameState.hintsUsed * GAME_CONFIG.HINT_PENALTY;
    return GAME_CONFIG.BASE_POINTS + timeBonus - hintsPenalty;
}
```

* O tempo que sobrou vira bônus.
* Dicas usadas reduzem os pontos.

---

### **10. Dicas**

* O jogador pode clicar para receber uma sugestão (limitado a 3).
* Dicas são exibidas como botões clicáveis que preenchem o campo de resposta.

---

### **11. Rodadas**

A cada rodada:

* Escolhe uma música aleatória.
* Atualiza a interface.
* Em modo multiplayer, muda o jogador atual.

---

### **12. Fim do Jogo**

Quando todas as rodadas acabam ou todos os jogadores desistem:

* Exibe o placar final.
* Em multiplayer, mostra o ranking e quem venceu.

---

### **Resumo Geral**

Este é um **jogo de quiz musical** onde:

* Você ou outros jogadores escutam um trecho de música.
* Tentam adivinhar título ou artista.
* Ganham pontos conforme o desempenho.
* O jogo termina após 30 rodadas ou se todos desistirem.

---

