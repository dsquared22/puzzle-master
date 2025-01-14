// Game state
let score = 0;
let level = 1;
let timeLeft = 60;
let timer;
let matchedPieces = new Set();
let currentLevelData = null;
let usedProblemsThisSession = new Set();
let mathProblems = null;

// Load math problems from JSON file
async function loadMathProblems() {
    try {
        const response = await fetch('mathProblems.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        mathProblems = await response.json();
        console.log('Math problems loaded successfully');
        initGame(); // Start the game after loading problems
    } catch (error) {
        console.error('Error loading math problems:', error);
        alert('Error loading math problems. Please check the console for details.');
    }
}

// ... keep all existing functions the same until window.addEventListener ...

// Set up event listeners
window.addEventListener('load', () => {
    // Load sounds first
    loadSounds();
    
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
    
    // Load math problems before starting the game
    loadMathProblems();
});