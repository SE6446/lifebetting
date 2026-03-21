console.log("1. Script file reached"); // This should show immediately

let questions = {};
let score = 0;
let startTime;
let elapsedTime = 0;
let stopWatchInterval;
const sfx = new Audio('assets/wall_street_opening.mp3');

function initializeGame() {
    let currentScore = 10;
    window.valueUpdater = new ValueUpdater(150, 50);
    console.log("Initializing game...");
    window.valueUpdater.start();
    startStopwatch();
    loadQuestions().then(() => {console.log("Questions loaded, starting game..."); triggerEvent().then()}).catch(err => console.error("Error loading questions:", err));
    
}
y
// Add the 'async' keyword here
async function loadQuestions() {
    try {
        const response = await fetch('./questions.json');
        if (!response.ok) throw new Error("File not found");
        questions = await response.json();
        console.log("Questions loaded successfully:", questions);
        return true;
        console.log("Loaded via Fetch");
    } catch (err) {
        console.error("Fetch failed. Use a local server (Live Server).", err);
        return false;
    }
}


    function scheduleNextQuestion() {
        const randomDelay= Math.random() * (30000 - 10000) + 1000; // Random delay between 10 and 30 seconds
        setTimeout(triggerEvent, randomDelay);
}

let hasTriggeredEvent = false; // Flag to ensure 10s event only happens once

async function triggerEvent() {
    const keys = Object.keys(questions);
    
    // Safety check: if no questions exist, stop here
    if (keys.length === 0) {
        console.error("No questions found in the script variable.");
        return false;
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const q = questions[randomKey];

    // FIX: Using BACKTICKS (`) for the template string
    const promptMessage = `${q.text}\n\n` + 
        q.options.map((opt, index) => `${index + 1}. ${opt}`).join('\n');
    
    const choice = prompt(promptMessage);
    
    if (choice === "1") applyScoreChange('correct');
    else if (choice === "2") applyScoreChange('almost correct');
    else if (choice === "3") applyScoreChange('incorrect');
    scheduleNextQuestion();
}


function startStopwatch() {
    if (stopWatchInterval) clearInterval(stopWatchInterval);
    startTime = Date.now();
    hasTriggeredEvent = false; // Reset flag

    stopWatchInterval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;
        const totalSeconds = Math.floor(diff / 1000);

        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = `${mins}:${secs}`;
        }
    }, 1000);
}
function applyScoreChange(type) {
    if (type === 'correct') {
        score.score *=5;
    } else if (type === 'almost correct') {
        score.score + 0;
    } else if (type === 'incorrect') {
        score.score -= (score.score * 0.035);
     } else {
            console.log("Invalid choice, no score change.");
            score.updateUI();
            scheduleNextQuestion();
            return;
        
     }



    }
    
 function startStopwatch() {
    if (stopWatchInterval) clearInterval(stopWatchInterval);

    //Set the start time
    startTime = Date.now();

    //Start the loop
    stopwatchInterval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;

        // Convert ms to MM:SS
        const totalSeconds = Math.floor(diff / 1000);
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = `${mins}:${secs}`;
            timerElement.classList.add('text-white'); // Apply Bloomberg white
        }
    }, 1000);
}

    function updateStopwatch(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString.padStart(2, '0');

        const seconds = document.getElementById('stopwatch');
        if (timerDisplay){
            timerDisplay.innerText = `Time: ${minutes}:${seconds}`;
        }
    }
    if (!window.valueUpdater.isRunning) {
        sfx.play().catch(error => {
            console.error("Error playing sound:", error);
        });
        window.valueUpdater.start();
    }



function buyShares() {
    console.log("Buy shares clicked");
    // Implement buying shares logic here
}
function sellShares() {
    console.log("Sell shares clicked");
    // Implement selling shares logic here
}




