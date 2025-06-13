// game.js - Versão Completa e Aprimorada

// Constantes do Jogo
const GAME_CONFIG = {
    TOTAL_ROUNDS: 30,
    TIME_PER_ROUND: 30,
    MAX_HINTS: 3,
    HINT_PENALTY: 10,
    BASE_POINTS: 50,
    TIME_BONUS_INTERVAL: 5 // 1 ponto a cada 5 segundos
};

// Estado do Jogo
const gameState = {
    currentRound: 1,
    timeLeft: GAME_CONFIG.TIME_PER_ROUND,
    timer: null,
    gameMode: 'single',
    players: [],
    currentPlayerIndex: 0,
    hintsUsed: 0,
    gameActive: false,
    musicPlaying: false,
    audioContext: null,
    currentSong: null,
    
    // Banco de dados de músicas (exemplo expandido)
    songs: [
        { 
            title: "Aroma Insano", 
            artist: "Gerilson Insrael", 
            clip: "audio/musica1.mp3",
            hints: ["3 Finer", "Gerilson Insrael", "Anselmo Ralph", "Anderson Mário"],
            year: 2025
        },
        { 
            title: "Tropa da Caop A, B, C, D", 
            artist: "Gumastó x Ednardo Soares x Puto Milagre", 
            clip: "audio/musica2.mp3",
            hints: ["Gumastó x Ednardo Soares x Puto Milagre", "Ednardo Soares", "Ednardo Soares x Puto Milagre", "Jlo Lourenço"],
            year: 2024
        },
        { 
            title: "Move", 
            artist: "Camila Cabello", 
            clip: "audio/musica3.mp3",
            hints: ["Move (feat. Camila Cabello)", "Carl Cabello", "Camilo Cabello", "Skyfall"],
            year: 2010
        },
        { 
            title: "Sorta", 
            artist: "João Lourenço", 
            clip: "audio/musica4.mp3",
            hints: ["Ze Du", "Paulo Kibrilha", "Team Suicida", "João Lourenço"],
            year: 2025
        },
        { 
            title: "Frenesi", 
            artist: "Yuri da Cunha e Ary", 
            clip: "audio/musica5.mp3",
            hints: ["Yuri da Cunha e Ary", "C4 Pedro e Ary", "Ary e Matias Damasio", "Yuri da Cunha e C4 Pedro"],
            year: 1965
        },
        { 
            title: "Wake Me Up", 
            artist: "Avicii", 
            clip: "audio/musica6.mp3",
            hints: ["Ed Sheran", "Justin Biber", "Wake", "Avicii"],
            year: 2013
        },
        {
            title: "Photograph", 
            artist: "Ed Sheeran", 
            clip: "audio/musica7.mp3",
            hints: ["Ed Sheran", "Justin Biber", "Shape", "Sheeran"],
            year: 2017
        }
        // Adicione mais músicas conforme necessário
        
    ],
    
    // Música atual sendo reproduzida
    audioBuffer: null,
    audioSource: null
};

// Elementos do DOM
const DOM = {
    musicAudio: document.getElementById('music-audio'),
    timer: document.getElementById('timer'),
    roundInfo: document.getElementById('round-info'),
    playBtn: document.getElementById('play-btn'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    hintBtn: document.getElementById('hint-btn'),
    hintsContainer: document.getElementById('hints-container'),
    hintsList: document.getElementById('hints-list'),
    playerInfo: document.getElementById('player-info'),
    multiplayerStatus: document.getElementById('multiplayer-status'),
    currentPlayerDisplay: document.getElementById('current-player'),
    quitBtn: document.getElementById('quit-btn'),
    
    // Modais
    resultsModal: new bootstrap.Modal(document.getElementById('resultsModal')),
    gameOverModal: new bootstrap.Modal(document.getElementById('gameOverModal')),
    
    // Elementos de resultado
    correctResult: document.getElementById('correct-result'),
    wrongResult: document.getElementById('wrong-result'),
    correctAnswerText: document.getElementById('correct-answer-text'),
    pointsEarned: document.getElementById('points-earned'),
    correctAnswer: document.getElementById('correct-answer'),
    finalScore: document.getElementById('final-score'),
    winnerText: document.getElementById('winner-text'),
    multiplayerResults: document.getElementById('multiplayer-results'),
    playersRanking: document.getElementById('players-ranking'),
    
    // Botões de ação
    nextRoundBtn: document.getElementById('next-round-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn')
};

// Inicialização do Jogo
function initGame() {
    // Configurar modo de jogo
    setupGameMode();
    
    // Configurar eventos
    setupEventListeners();
    
    // Iniciar AudioContext (para reprodução de áudio)
    initAudioContext();
    
    // Iniciar primeira rodada
    startRound();
}

// Configurar modo de jogo
function setupGameMode() {
    gameState.gameMode = localStorage.getItem('gameMode') || 'single';
    
    if (gameState.gameMode === 'single') {
        setupSinglePlayer();
    } else {
        setupMultiplayer();
    }
}

// Configurar single player
function setupSinglePlayer() {
    gameState.players = [
        createPlayer("Jogador", "default_user.jpg")
    ];
    
    updatePlayerInfo();
    DOM.multiplayerStatus.classList.add('d-none');
    DOM.currentPlayerDisplay.classList.add('d-none');
    DOM.quitBtn.textContent = "Parar Jogo";
}

// Configurar multiplayer (simulado)
function setupMultiplayer() {
    gameState.players = [
        createPlayer("Jogador 1", "user1.jpg"),
        createPlayer("Jogador 2", "user2.jpg"),
        createPlayer("Jogador 3", "user3.jpg"),
        createPlayer("Jogador 4", "user4.jpg")
    ];
    
    updatePlayerInfo();
    updateMultiplayerStatus();
    DOM.multiplayerStatus.classList.remove('d-none');
    DOM.currentPlayerDisplay.classList.remove('d-none');
    DOM.quitBtn.textContent = "Desistir";
}

// Criar objeto de jogador
function createPlayer(name, avatar) {
    return {
        name,
        avatar,
        points: 0,
        correctAnswers: 0,
        active: true,
        hintsUsed: 0
    };
}

// Inicializar AudioContext
function initAudioContext() {
    try {
        gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.error("Web Audio API não suportada neste navegador");
        // Fallback: usar elementos de áudio HTML5
    }
}

// Configurar event listeners
function setupEventListeners() {
    DOM.playBtn.addEventListener('click', playMusicClip);
    DOM.submitBtn.addEventListener('click', checkAnswer);
    DOM.answerInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkAnswer());
    DOM.hintBtn.addEventListener('click', showHints);
    DOM.quitBtn.addEventListener('click', quitGame);
    
    // Eventos de modais
    DOM.nextRoundBtn.addEventListener('click', nextRound);
    DOM.playAgainBtn.addEventListener('click', playAgain);
    DOM.mainMenuBtn.addEventListener('click', () => window.location.href = 'index.html');
    
    // Pausar música quando o modal é fechado
    DOM.resultsModal._element.addEventListener('hidden.bs.modal', () => {
        if (gameState.audioSource) {
            gameState.audioSource.stop();
            gameState.musicPlaying = false;
        }
    });
}

// Iniciar rodada
function startRound() {
    resetRoundState();
    selectRandomSong();
    updateUIForNewRound();
    
    // Em multiplayer, verificar jogador atual
    if (gameState.gameMode === 'multi') {
        handleMultiplayerRoundStart();
    }
}

// Reiniciar estado da rodada
function resetRoundState() {
    gameState.gameActive = true;
    gameState.hintsUsed = 0;
    gameState.timeLeft = GAME_CONFIG.TIME_PER_ROUND;
    clearInterval(gameState.timer);
}

// Selecionar música aleatória
function selectRandomSong() {
    const availableSongs = gameState.songs.filter(song => song !== gameState.currentSong);
    gameState.currentSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
}

// Atualizar UI para nova rodada
function updateUIForNewRound() {
    DOM.roundInfo.textContent = `Rodada ${gameState.currentRound} de ${GAME_CONFIG.TOTAL_ROUNDS}`;
    DOM.timer.textContent = gameState.timeLeft;
    DOM.answerInput.value = '';
    DOM.answerInput.disabled = true;
    DOM.submitBtn.disabled = true;
    DOM.playBtn.disabled = false;
    DOM.hintsContainer.classList.add('d-none');
    DOM.hintBtn.textContent = `Sugestões (${GAME_CONFIG.MAX_HINTS} restantes)`;
    DOM.hintBtn.disabled = false;
}

// Manipular início de rodada multiplayer
function handleMultiplayerRoundStart() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (!currentPlayer.active) {
        nextPlayer();
        return;
    }
    
    updateMultiplayerStatus();
    DOM.currentPlayerDisplay.innerHTML = `<i class="fas fa-user me-2"></i>Vez de: ${currentPlayer.name}`;
}

// Tocar trecho musical
async function playMusicClip() {
    if (gameState.musicPlaying) return;

    gameState.musicPlaying = true;
    DOM.playBtn.disabled = true;
    DOM.playBtn.innerHTML = '<i class="fas fa-volume-up me-2"></i>Tocando...';

    try {
        // Defina o src do elemento audio para o trecho da música atual
        DOM.musicAudio.src = gameState.currentSong.clip;
        DOM.musicAudio.currentTime = 0;
        DOM.musicAudio.play();

        // Quando o áudio terminar, habilite o input
        DOM.musicAudio.onended = () => {
            DOM.answerInput.disabled = false;
            DOM.submitBtn.disabled = false;
            DOM.answerInput.focus();
            startTimer();
        };

        setTimeout(() => {
        DOM.musicAudio.pause();
        DOM.answerInput.disabled = false;
        DOM.submitBtn.disabled = false;
        DOM.answerInput.focus();
        startTimer();
        }, 5000);

    } catch (error) {
        console.error("Erro ao reproduzir música:", error);
        handleAudioError();
    }
}

// Carregar arquivo de áudio (simulado)
async function loadAudio(filename) {
    // Em uma aplicação real, implementar o carregamento do áudio
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Manipular erro de áudio
function handleAudioError() {
    gameState.musicPlaying = false;
    DOM.playBtn.innerHTML = '<i class="fas fa-play me-2"></i>Tocar Trecho';
    DOM.playBtn.disabled = false;
    
    alert("Erro ao carregar a música. Por favor, tente novamente.");
}

// Iniciar timer
function startTimer() {
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        DOM.timer.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUp();
        }
    }, 1000);
}

// Tempo esgotado
function timeUp() {
    endMusicPlayback();
    showResult(false);
}

// Finalizar reprodução de música
function endMusicPlayback() {
    gameState.musicPlaying = false;
    DOM.playBtn.innerHTML = '<i class="fas fa-play me-2"></i>Tocar Trecho';

    if (DOM.musicAudio) {
        DOM.musicAudio.pause();
        DOM.musicAudio.currentTime = 0;
    }
    if (gameState.audioSource) {
        gameState.audioSource.stop();
    }
}

// Verificar resposta
function checkAnswer() {
    if (!gameState.gameActive) return;
    
    const answer = DOM.answerInput.value.trim().toLowerCase();
    const isCorrect = checkAnswerCorrectness(answer);
    
    endMusicPlayback();
    clearInterval(gameState.timer);
    
    if (isCorrect) {
        updatePlayerScore();
    }
    
    showResult(isCorrect);
}

// Verificar se a resposta está correta
function checkAnswerCorrectness(answer) {
    const title = gameState.currentSong.title.toLowerCase();
    const artist = gameState.currentSong.artist.toLowerCase();
    
    // Verificar correspondência com título ou artista
    return answer.includes(title) || answer.includes(artist) ||
           title.includes(answer) || artist.includes(answer);
}

// Atualizar pontuação do jogador
function updatePlayerScore() {
    const pointsEarned = calculatePoints();
    const player = gameState.gameMode === 'single' ? 
        gameState.players[0] : 
        gameState.players[gameState.currentPlayerIndex];
    
    player.points += pointsEarned;
    player.correctAnswers++;
    
    if (gameState.gameMode === 'single') {
        updatePlayerInfo();
    } else {
        updateMultiplayerStatus();
    }
}

// Calcular pontos ganhos
function calculatePoints() {
    const timeBonus = Math.floor(gameState.timeLeft / GAME_CONFIG.TIME_BONUS_INTERVAL);
    const hintsPenalty = gameState.hintsUsed * GAME_CONFIG.HINT_PENALTY;
    return GAME_CONFIG.BASE_POINTS + timeBonus - hintsPenalty;
}

// Mostrar resultado
function showResult(isCorrect) {
    gameState.gameActive = false;
    
    if (isCorrect) {
        showCorrectResult();
    } else {
        showWrongResult();
    }
    
    DOM.resultsModal.show();
}

// Mostrar resultado correto
function showCorrectResult() {
    DOM.correctResult.classList.remove('d-none');
    DOM.wrongResult.classList.add('d-none');
    
    DOM.correctAnswerText.innerHTML = `
        Música: <span class="fw-bold">${gameState.currentSong.title}</span><br>
        Artista: <span class="fw-bold">${gameState.currentSong.artist}</span>
    `;
    
    DOM.pointsEarned.textContent = `+${calculatePoints()} pontos`;
}

// Mostrar resultado incorreto
function showWrongResult() {
    DOM.correctResult.classList.add('d-none');
    DOM.wrongResult.classList.remove('d-none');
    
    DOM.correctAnswer.innerHTML = `
        A resposta era: <span class="fw-bold">${gameState.currentSong.title}</span> - 
        <span class="fw-bold">${gameState.currentSong.artist}</span>
    `;
}

// Próxima rodada
function nextRound() {
    DOM.resultsModal.hide();
    gameState.currentRound++;
    
    if (isGameOver()) {
        endGame();
        return;
    }
    
    if (gameState.gameMode === 'multi') {
        nextPlayer();
    }
    
    startRound();
}

// Verificar se o jogo acabou
function isGameOver() {
    return gameState.currentRound > GAME_CONFIG.TOTAL_ROUNDS || 
          (gameState.gameMode === 'multi' && !hasActivePlayers());
}

// Verificar se há jogadores ativos (multiplayer)
function hasActivePlayers() {
    return gameState.players.some(player => player.active);
}

// Próximo jogador (multiplayer)
function nextPlayer() {
    do {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    } while (!gameState.players[gameState.currentPlayerIndex].active && hasActivePlayers());
}

// Mostrar dicas
function showHints() {
    if (gameState.hintsUsed >= GAME_CONFIG.MAX_HINTS || !gameState.gameActive) return;
    
    gameState.hintsUsed++;
    updateHintsButton();
    displayAvailableHints();
    DOM.hintsContainer.classList.remove('d-none');
}

// Atualizar botão de dicas
function updateHintsButton() {
    const hintsLeft = GAME_CONFIG.MAX_HINTS - gameState.hintsUsed;
    DOM.hintBtn.textContent = `Sugestões (${hintsLeft} restantes)`;
    
    if (hintsLeft <= 0) {
        DOM.hintBtn.disabled = true;
    }
}

// Exibir dicas disponíveis
function displayAvailableHints() {
    DOM.hintsList.innerHTML = '';
    
    const allHints = [...gameState.currentSong.hints];
    
    // Adicionar resposta correta aleatoriamente
    if (Math.random() > 0.5) {
        allHints.push(gameState.currentSong.title);
    } else {
        allHints.push(gameState.currentSong.artist);
    }
    
    shuffleArray(allHints).forEach(hint => {
        const hintElement = createHintElement(hint);
        DOM.hintsList.appendChild(hintElement);
    });
}

// Criar elemento de dica
function createHintElement(hint) {
    const hintBadge = document.createElement('span');
    hintBadge.className = 'badge bg-secondary hint-badge';
    hintBadge.textContent = hint;
    
    hintBadge.addEventListener('click', () => {
        DOM.answerInput.value = hint;
        DOM.answerInput.focus();
    });
    
    return hintBadge;
}

// Embaralhar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Sair/desistir do jogo
function quitGame() {
    if (gameState.gameMode === 'single') {
        endGame();
    } else {
        handleMultiplayerQuit();
    }
}

// Manipular desistência multiplayer
function handleMultiplayerQuit() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.active = false;
    
    updateMultiplayerStatus();
    
    if (hasActivePlayers()) {
        nextPlayer();
        startRound();
    } else {
        endGame();
    }
}

// Finalizar jogo
function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timer);
    endMusicPlayback();
    
    prepareGameOverModal();
    DOM.gameOverModal.show();
}

// Preparar modal de fim de jogo
function prepareGameOverModal() {
    if (gameState.gameMode === 'single') {
        prepareSinglePlayerResults();
    } else {
        prepareMultiplayerResults();
    }
}

// Preparar resultados single player
function prepareSinglePlayerResults() {
    const player = gameState.players[0];
    DOM.finalScore.textContent = player.points;
    DOM.winnerText.textContent = `Você fez ${player.points} pontos!`;
    DOM.multiplayerResults.classList.add('d-none');
}

// Preparar resultados multiplayer
function prepareMultiplayerResults() {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.points - a.points);
    const topScore = sortedPlayers[0].points;
    const winners = sortedPlayers.filter(p => p.points === topScore);
    
    setWinnerText(winners, topScore);
    displayPlayersRanking(sortedPlayers);
    DOM.multiplayerResults.classList.remove('d-none');
}

// Definir texto do vencedor
function setWinnerText(winners, topScore) {
    if (winners.length === 1) {
        DOM.winnerText.textContent = `${winners[0].name} venceu com ${topScore} pontos!`;
    } else {
        const winnersNames = winners.map(p => p.name).join(', ');
        DOM.winnerText.textContent = `Empate entre ${winnersNames} com ${topScore} pontos!`;
    }
}

// Exibir ranking de jogadores
function displayPlayersRanking(players) {
    DOM.playersRanking.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerRow = document.createElement('div');
        playerRow.className = `d-flex justify-content-between align-items-center mb-2 p-2 ${player.active ? 'bg-secondary' : 'bg-dark'}`;
        
        playerRow.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="me-3">${index + 1}º</span>
                <img src="img/user.png" alt="${player.name}" class="rounded-circle me-2" width="30" height="30">
                <span>${player.name}</span>
            </div>
            <div>
                <span class="badge bg-primary me-2">${player.points} pts</span>
                <span class="badge bg-success">${player.correctAnswers} ✓</span>
            </div>
        `;
        
        DOM.playersRanking.appendChild(playerRow);
    });
}

// Jogar novamente
function playAgain() {
    DOM.gameOverModal.hide();
    resetGameState();
    startRound();
}

// Reiniciar estado do jogo
function resetGameState() {
    gameState.currentRound = 1;
    gameState.players.forEach(player => {
        player.points = 0;
        player.correctAnswers = 0;
        player.active = true;
        player.hintsUsed = 0;
    });
    gameState.currentPlayerIndex = 0;
}

// Atualizar informações do jogador
function updatePlayerInfo() {
    const player = gameState.players[0];
    DOM.playerInfo.innerHTML = `
        <img src="img/user.png" alt="${player.name}" class="rounded-circle me-2" width="30" height="30">
        <span class="me-2">${player.name}</span>
        <span class="badge bg-primary">${player.points} pts</span>
    `;
}

// Atualizar status multiplayer
function updateMultiplayerStatus() {
    DOM.multiplayerStatus.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = `col-6 col-md-3 mb-3`;
        
        playerCard.innerHTML = `
            <div class="player-card ${index === gameState.currentPlayerIndex ? 'active' : ''} ${player.active ? 'bg-secondary' : 'bg-dark'}">
                <img src="img/user.png" alt="${player.name}" class="avatar">
                <h6 class="mb-1">${player.name}</h6>
                <div class="d-flex justify-content-center gap-2">
                    <span class="badge bg-primary">${player.points} pts</span>
                    <span class="badge bg-success">${player.correctAnswers} ✓</span>
                </div>
                ${!player.active ? '<div class="mt-1"><span class="badge bg-danger">Desistiu</span></div>' : ''}
            </div>
        `;
        
        DOM.multiplayerStatus.appendChild(playerCard);
    });
}

// Iniciar o jogo quando a página carregar
window.onload = initGame;