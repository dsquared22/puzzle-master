// Game state
let score = 0;
let level = 1;
let timeLeft = 60;
let timer;
let matchedPieces = new Set();
let currentLevelData = null;
let usedProblemsThisSession = new Set();

// Sound effects
const sounds = {
    correct: new Audio('sounds/correct.mp3'),
    wrong: new Audio('sounds/wrong.mp3'),
    levelComplete: new Audio('sounds/level-complete.mp3')
};

// Mute state
let isMuted = false;

// Function to play sound if not muted
function playSound(soundName) {
    if (!isMuted && sounds[soundName]) {
        sounds[soundName].play();
    }
}

// Math problems database
const mathProblems = {
    addition: {
        easy: [
            { text: '3 + 4', answer: '7' },
            { text: '5 + 2', answer: '7' },
            { text: '6 + 3', answer: '9' },
            { text: '4 + 5', answer: '9' },
            { text: '2 + 6', answer: '8' },
            { text: '1 + 7', answer: '8' },
            { text: '3 + 5', answer: '8' },
            { text: '6 + 2', answer: '8' },
            { text: '4 + 6', answer: '10' },
            { text: '8 + 3', answer: '11' },
            { text: '7 + 5', answer: '12' },
            { text: '9 + 4', answer: '13' }
        ],
        medium: [
            { text: '12 + 15', answer: '27' },
            { text: '18 + 23', answer: '41' },
            { text: '25 + 16', answer: '41' },
            { text: '31 + 19', answer: '50' },
            { text: '45 + 27', answer: '72' },
            { text: '38 + 45', answer: '83' },
            { text: '56 + 37', answer: '93' },
            { text: '64 + 28', answer: '92' }
        ],
        hard: [
            { text: '123 + 456', answer: '579' },
            { text: '234 + 567', answer: '801' },
            { text: '345 + 678', answer: '1023' },
            { text: '789 + 234', answer: '1023' },
            { text: '456 + 789', answer: '1245' },
            { text: '678 + 345', answer: '1023' }
        ]
    },
    subtraction: {
        easy: [
            { text: '9 - 4', answer: '5' },
            { text: '8 - 3', answer: '5' },
            { text: '7 - 2', answer: '5' },
            { text: '10 - 3', answer: '7' },
            { text: '12 - 4', answer: '8' },
            { text: '15 - 6', answer: '9' },
            { text: '11 - 3', answer: '8' },
            { text: '14 - 5', answer: '9' },
            { text: '13 - 6', answer: '7' },
            { text: '16 - 7', answer: '9' }
        ],
        medium: [
            { text: '23 - 15', answer: '8' },
            { text: '45 - 27', answer: '18' },
            { text: '56 - 38', answer: '18' },
            { text: '72 - 45', answer: '27' },
            { text: '89 - 52', answer: '37' },
            { text: '95 - 48', answer: '47' },
            { text: '84 - 37', answer: '47' },
            { text: '67 - 29', answer: '38' }
        ],
        hard: [
            { text: '234 - 156', answer: '78' },
            { text: '567 - 289', answer: '278' },
            { text: '789 - 456', answer: '333' },
            { text: '876 - 387', answer: '489' },
            { text: '654 - 278', answer: '376' },
            { text: '923 - 547', answer: '376' }
        ]
    },
    multiplication: {
        easy: [
            { text: '2 × 3', answer: '6' },
            { text: '3 × 4', answer: '12' },
            { text: '5 × 2', answer: '10' },
            { text: '4 × 3', answer: '12' },
            { text: '6 × 2', answer: '12' },
            { text: '3 × 5', answer: '15' },
            { text: '4 × 4', answer: '16' },
            { text: '3 × 6', answer: '18' },
            { text: '5 × 4', answer: '20' },
            { text: '6 × 4', answer: '24' }
        ],
        medium: [
            { text: '12 × 5', answer: '60' },
            { text: '8 × 7', answer: '56' },
            { text: '9 × 6', answer: '54' },
            { text: '7 × 9', answer: '63' },
            { text: '11 × 6', answer: '66' },
            { text: '8 × 9', answer: '72' },
            { text: '13 × 6', answer: '78' },
            { text: '12 × 7', answer: '84' }
        ],
        hard: [
            { text: '23 × 5', answer: '115' },
            { text: '34 × 6', answer: '204' },
            { text: '18 × 9', answer: '162' },
            { text: '25 × 8', answer: '200' },
            { text: '16 × 15', answer: '240' },
            { text: '22 × 12', answer: '264' },
            { text: '19 × 14', answer: '266' },
            { text: '27 × 11', answer: '297' }
        ]
    },
    division: {
        easy: [
            { text: '6 ÷ 2', answer: '3' },
            { text: '8 ÷ 4', answer: '2' },
            { text: '9 ÷ 3', answer: '3' },
            { text: '10 ÷ 2', answer: '5' },
            { text: '12 ÷ 3', answer: '4' },
            { text: '14 ÷ 2', answer: '7' },
            { text: '15 ÷ 3', answer: '5' },
            { text: '16 ÷ 4', answer: '4' },
            { text: '18 ÷ 3', answer: '6' },
            { text: '20 ÷ 4', answer: '5' }
        ],
        medium: [
            { text: '24 ÷ 6', answer: '4' },
            { text: '35 ÷ 7', answer: '5' },
            { text: '48 ÷ 8', answer: '6' },
            { text: '54 ÷ 9', answer: '6' },
            { text: '63 ÷ 7', answer: '9' },
            { text: '72 ÷ 8', answer: '9' },
            { text: '81 ÷ 9', answer: '9' },
            { text: '96 ÷ 12', answer: '8' }
        ],
        hard: [
            { text: '144 ÷ 12', answer: '12' },
            { text: '225 ÷ 15', answer: '15' },
            { text: '336 ÷ 16', answer: '21' },
            { text: '256 ÷ 16', answer: '16' },
            { text: '288 ÷ 18', answer: '16' },
            { text: '324 ÷ 18', answer: '18' },
            { text: '392 ÷ 14', answer: '28' },
            { text: '441 ÷ 21', answer: '21' }
        ]
    }
};

// Function to generate problems for a level
function generateProblems(level) {
    const problems = [];
    const usedAnswers = new Set();
    let difficulty;
    let operations;

    // Define difficulty and operations based on level
    if (level <= 3) {
        difficulty = 'easy';
        operations = level === 1 ? ['addition'] 
                  : level === 2 ? ['addition', 'subtraction']
                  : ['addition', 'subtraction', 'multiplication'];
    } else if (level <= 6) {
        difficulty = 'medium';
        operations = ['addition', 'subtraction', 'multiplication', 'division'];
    } else {
        difficulty = 'hard';
        operations = ['addition', 'subtraction', 'multiplication', 'division'];
    }

    // Get random problems with unique answers
    while (problems.length < 3) {
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const availableProblems = mathProblems[operation][difficulty].filter(
            p => !usedAnswers.has(p.answer) && !usedProblemsThisSession.has(p.text)
        );
        
        if (availableProblems.length === 0) {
            // If we run out of unused problems, clear the session history for this difficulty
            usedProblemsThisSession.clear();
            continue;
        }
        
        const randomIndex = Math.floor(Math.random() * availableProblems.length);
        const problem = availableProblems[randomIndex];
        
        problems.push({
            id: `eq${problems.length + 1}`,
            text: problem.text,
            answer: problem.answer,
            x: 50,
            y: 50 + (problems.length * 120)
        });
        
        usedAnswers.add(problem.answer);
        usedProblemsThisSession.add(problem.text);
    }

    return problems;
}

// Level data (keeping the original levels 1-3 for fallback)
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
    },
    3: {
        pieces: [
            { id: 'eq1', text: '25 - 12', answer: '13', x: 50, y: 50 },
            { id: 'eq2', text: '8 × 4', answer: '32', x: 50, y: 170 },
            { id: 'eq3', text: '45 ÷ 5', answer: '9', x: 50, y: 290 }
        ],
        targets: [
            { id: 'eq1', text: '13', x: 750, y: 170 },
            { id: 'eq2', text: '32', x: 750, y: 290 },
            { id: 'eq3', text: '9', x: 750, y: 50 }
        ]
    }
};

// Function to create level data with random problems
function createLevelData(level) {
    // For levels 1-3, use the predefined problems
    if (level <= 3 && levelData[level]) {
        return levelData[level];
    }
    
    // For higher levels, generate random problems
    const pieces = generateProblems(level);
    const targets = pieces.map((piece, index) => ({
        id: piece.id,
        text: piece.answer,
        x: 750,
        y: [170, 290, 50][index] // Keep the same target positions as original levels
    }));
    
    return { pieces, targets };
}

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
    
    // Use stored level data instead of generating new data
    const draggedProblem = currentLevelData.pieces.find(p => p.id === pieceId);
    const targetAnswer = target.textContent;
    
    // Check if this is the correct match based on the actual answer
    if (draggedProblem && draggedProblem.answer === targetAnswer) {
        playSound('correct');
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
        if (matchedPieces.size === 3) {
            handleLevelComplete();
        }
    } else {
        playSound('wrong');
        // If incorrect match, return piece to original position
        const originalPiece = currentLevelData.pieces.find(p => p.id === pieceId);
        if (originalPiece) {
            piece.style.left = originalPiece.x + 'px';
            piece.style.top = originalPiece.y + 'px';
        }
    }
}

function handleLevelComplete() {
    playSound('levelComplete');
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
    usedProblemsThisSession.clear();
    initGame();
}

function nextLevel() {
    level++;
    if (level > 10) {
        const playAgain = confirm('🎉 Congratulations! You\'ve completed all levels! 🎉\nFinal score: ' + score + '\n\nWould you like to play again?');
        if (playAgain) {
            level = 1;
            score = 0;
            usedProblemsThisSession.clear();
            document.getElementById('score').textContent = score;
        } else {
            return;
        }
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
    const gameBoard = document.getElementById('gameBoard');
    currentLevelData = createLevelData(level);
    
    // Update instructions based on level
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        let operationsText = level <= 3 ? 'addition and subtraction' 
                         : level <= 6 ? 'all basic operations with medium difficulty'
                         : 'all operations with higher difficulty';
        instructions.innerHTML = `
            <p>Level ${level} - Match the equations with their answers!</p>
            <p>🎯 Using ${operationsText}</p>
        `;
    }
    
    // Create puzzle pieces
    currentLevelData.pieces.forEach(piece => {
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
    currentLevelData.targets.forEach(target => {
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
    
    // Add mute button
    const muteBtn = document.createElement('button');
    muteBtn.id = 'mute-btn';
    muteBtn.innerHTML = '🔊';
    muteBtn.style.marginLeft = '10px';
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
    });
    document.querySelector('.button-container').appendChild(muteBtn);
    
    initGame();
});