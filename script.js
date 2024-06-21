document.addEventListener('DOMContentLoaded', () => {
    const setupDiv = document.getElementById('setup');
    const gameDiv = document.getElementById('game');
    const startGameButton = document.getElementById('startGameButton');
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const player1HistoryContent = document.getElementById('player1HistoryContent');
    const player2HistoryContent = document.getElementById('player2HistoryContent');
    const turnIndicator = document.getElementById('turnIndicator');
    const player1HistoryTitle = document.getElementById('player1HistoryTitle');
    const player2HistoryTitle = document.getElementById('player2HistoryTitle');
    
    let player1 = { name: '', number: '' };
    let player2 = { name: '', number: '' };
    let currentPlayer = 1;
    
    document.getElementById('cpuBattle').addEventListener('change', function() {
        var numberInput = document.getElementById('player2Number');
        numberInput.style.display = this.checked ? 'none' : 'inline';
    });
    
    startGameButton.addEventListener('click', startGame);
    guessButton.addEventListener('click', handleGuess);
    
    function startGame() {
        player1.name = document.getElementById('player1Name').value;
        player1.number = document.getElementById('player1Number').value;
        player2.name = document.getElementById('player2Name').value;
        player2.number = document.getElementById('player2Number').value;
    
        if (document.getElementById('cpuBattle').checked) {
            player2.number = generateUniqueSixDigitNumber();
        }
    
        if (validateSetup()) {
            player1HistoryTitle.textContent = `${player1.name}の質問`;
            player2HistoryTitle.textContent = `${player2.name}の質問`;
            setupDiv.style.display = 'none';
            gameDiv.style.display = 'block';
            updateTurnIndicator();
        } else {
            showErrorMessages();
        }
    }
    
    function handleGuess() {
        let guess = guessInput.value;
        if (!isValidGuess(guess)) {
            result.textContent = '一意の数字を含まない有効な6桁の番号を入力してください。';
            return;
        }
    
        let opponentNumber = currentPlayer === 1 ? player2.number : player1.number;
        let { hits, blows } = checkGuess(guess, opponentNumber);
    
        if (currentPlayer === 1) {
            player1HistoryContent.innerHTML += `<p>${guess} | H: ${hits} | B: ${blows}</p>`;
        } else {
            player2HistoryContent.innerHTML += `<p>${guess} | H: ${hits} | B: ${blows}</p>`;
        }
    
        guessInput.value = '';
    
        if (hits === 6) {
            result.textContent = `おめでとう！ ${getCurrentPlayer().name}! あなたは正解しました！！`;
            guessButton.disabled = true;
            guessInput.disabled = true;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            result.textContent = `Hits: ${hits}, Blows: ${blows}`;
            switchPlayer();
            if (document.getElementById('cpuBattle').checked && currentPlayer === 2) {
                cpuGuess();
            }
        }
    }
    
    function cpuGuess() {
        let opponentNumber = player1.number;
        let guess = generateUniqueSixDigitNumber();
        let { hits, blows } = checkGuess(guess, opponentNumber);
    
        player2HistoryContent.innerHTML += `<p>${guess} | H: ${hits} | B: ${blows}</p>`;
    
        if (hits === 6) {
            result.textContent = `${player1.name}は負けてしまいました`;
            guessButton.disabled = true;
            guessInput.disabled = true;
        } else {
            result.textContent = `Hits: ${hits}, Blows: ${blows}`;
            switchPlayer();
            updateTurnIndicator();
        }
    }
    
    function validateSetup() {
        return isValidGuess(player1.number) && isValidGuess(player2.number) && player1.name && player2.name;
    }
    
    function generateUniqueSixDigitNumber() {
        let digits = new Set();
    
        while (digits.size < 6) {
            let digit = Math.floor(Math.random() * 10);
            digits.add(digit);
        }
    
        return Array.from(digits).join('');
    }
    
    function showErrorMessages() {
        let errorMessage = '';
        if (!player1.name) {
            errorMessage += 'プレイヤー1の名前を入力してください。<br>';
        }
        if (!player2.name) {
            errorMessage += 'プレイヤー2の名前を入力してください。<br>';
        }
        if (!isValidGuess(player1.number)) {
            errorMessage += 'プレイヤー1の数値を有効な6桁の数字で入力してください。<br>';
        }
        if (!isValidGuess(player2.number) && !document.getElementById('cpuBattle').checked) {
            errorMessage += 'プレイヤー2の数値を有効な6桁の数字で入力してください。<br>';
        }
        error.innerHTML = errorMessage;
    }
    
    function isValidGuess(guess) {
        return guess.length === 6 && new Set(guess).size === 6 && /^\d{6}$/.test(guess);
    }
    
    function checkGuess(guess, answer) {
        let hits = 0;
        let blows = 0;
    
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === answer[i]) {
                hits++;
            } else if (answer.includes(guess[i])) {
                blows++;
            }
        }
    
        return { hits, blows };
    }
    
    function getCurrentPlayer() {
        return currentPlayer === 1 ? player1 : player2;
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnIndicator();
    }
    
    function updateTurnIndicator() {
        turnIndicator.textContent = `${getCurrentPlayer().name}の手番です！`;
    }
});
