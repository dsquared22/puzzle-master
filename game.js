// Game state
let score = 0;
let level = 1;
let timeLeft = 60;
let timer;
let matchedPieces = new Set();

console.log('Game script loaded');

// Game pieces data for different levels
const levelData = {
    1: {
        pieces: [
            { id: 'eq1', text: '7 + 3', answer: '10', x: 50, y: 50 },
            { id: 'eq2', text: '15 - 8', answer: '7', x: 50, y: 170 },
            { id: 'eq3', text: '4 × 3', answer: '12', x: 50, y: 290 }
        ],
        targets: [
            { id: 'eq1', text: '10', x: 750, y: 170 },
            { id: 'eq2', text: '7', x: 750, y: 290 },
            { id: 'eq3', text: '12', x: 750, y: 50 }
        ]
    },
    2: {
        pieces: [
            { id: 'eq1', text: '20 ÷ 4', answer: '5', x: 50, y: 50 },
            { id: 'eq2', text: '16 + 7', answer: '23', x: 50, y: 170 },
            { id: 'eq3', text: '9 × 6', answer: '54', x: 50, y: 290 }
        ],
        targets: [
            { id: 'eq1', text: '5', x: 750, y: 170 },
            { id: 'eq2', text: '23', x: 750, y: 290 },
            { id: 'eq3', text: '54', x: 750, y: 50 }
        ]
    }
};

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.target.closest('.target-spot')?.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.closest('.target-spot')?.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    const target = e.target.closest('.target-spot');
    
    if (!target) return;
    
    target.classList.remove('drag-over');
    
    // Check if this is the correct match
    if (target.dataset.id === pieceId) {
        // Clear existing content but save the answer
        const answerText = target.textContent;
        target.textContent = '';
        
        // Create a container for the matched content
        const matchedContainer = document.createElement('div');
        matchedContainer.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: rgba(0, 255, 157, 0.1);
            border: 2px solid rgba(0, 255, 157, 0.5);
            border-radius: 10px;
            pointer-events: none;
            padding: 5px;
        `;
        
        // Add the equation
        const equationDiv = document.createElement('div');
        equationDiv.textContent = piece.textContent;
        equationDiv.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
        `;
        
        // Add separator
        const separator = document.createElement('div');
        separator.textContent = '=';
        separator.style.cssText = `
            color: rgba(0, 255, 157, 0.8);
            font-weight: bold;
        `;
        
        // Add the answer
        const answerDiv = document.createElement('div');
        answerDiv.textContent = answerText;
        answerDiv.style.cssText = `
            color: #00ff9d;
            font-weight: bold;
        `;
        
        // Assemble the matched display
        matchedContainer.appendChild(equationDiv);
        matchedContainer.appendChild(separator);
        matchedContainer.appendChild(answerDiv);
        target.appendChild(matchedContainer);
        
        // Hide the original piece
        piece.style.display = 'none';
        piece.draggable = false;
        
        matchedPieces.add(pieceId);
        score += 10;
        document.getElementById('score').textContent = score;
        
        // Check if level is complete
        const currentLevelPieces = levelData[level].pieces;
        if (matchedPieces.size === currentLevelPieces.length) {
            handleLevelComplete();
        }
    } else {
        // If incorrect match, return piece to original position
        const originalPiece = levelData[level].pieces.find(p => p.id === pieceId);
        piece.style.left = originalPiece.x + 'px';
        piece.style.top = originalPiece.y + 'px';
    }
}

function handleLevelComplete() {
    clearInterval(timer);
    score += timeLeft;
    document.getElementById('score').textContent = score;
    
    // Show completion message
    const message = document.createElement('div');
    message.className = 'level-complete-message';
    message.innerHTML = `
        <h2>🎉 Level ${level} Complete! 🎉</h2>
        <p>Time Bonus: +${timeLeft} points</p>
        <p>Total Score: ${score}</p>
        <p>Click "Next Level" to continue!</p>
    `;
    document.body.appendChild(message);
    
    // Enable next level button
    document.getElementById('next-level-btn').disabled = false;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time\'s up! Try again.');
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    timeLeft = 60;
    document.getElementById('timer').textContent = timeLeft;
    initGame();
}

function nextLevel() {
    level++;
    if (level > Object.keys(levelData).length) {
        alert('🎉 Congratulations! You\'ve completed all levels! 🎉\nFinal score: ' + score);
        level = 1;
    }
    
    // Remove the level complete message
    const message = document.querySelector('.level-complete-message');
    if (message) {
        message.remove();
    }
    
    matchedPieces.clear();
    document.getElementById('level').textContent = level;
    document.getElementById('next-level-btn').disabled = true;
    clearInterval(timer);
    timeLeft = 60;
    document.getElementById('timer').textContent = timeLeft;
    
    // Clear the game board
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    // Initialize the new level
    initGame();
}

function initGame() {
    console.log('Initializing game...');
    const gameBoard = document.getElementById('gameBoard');
    const currentLevel = levelData[level];
    
    // Create puzzle pieces
    currentLevel.pieces.forEach(piece => {
        const element = document.createElement('div');
        element.id = piece.id;
        element.className = 'puzzle-piece';
        element.textContent = piece.text;
        element.style.left = piece.x + 'px';
        element.style.top = piece.y + 'px';
        element.draggable = true;
        
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        
        gameBoard.appendChild(element);
    });
    
    // Create target spots
    currentLevel.targets.forEach(target => {
        const element = document.createElement('div');
        element.className = 'target-spot';
        element.dataset.id = target.id;
        element.textContent = target.text;
        element.style.left = target.x + 'px';
        element.style.top = target.y + 'px';
        
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragleave', handleDragLeave);
        element.addEventListener('drop', handleDrop);
        
        gameBoard.appendChild(element);
    });
    
    startTimer();
}

// Set up event listeners
window.addEventListener('load', () => {
    document.getElementById('next-level-btn').addEventListener('click', nextLevel);
    document.getElementById('hint-btn').addEventListener('click', () => {
        alert('Match the math problems on the left with their answers on the right!');
    });
    initGame();
});