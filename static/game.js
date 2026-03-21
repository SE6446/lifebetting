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
    if (!window.valueUpdater.isRunning) {
    sfx.play().catch(error => {
        console.error("Error playing sound:", error);
    });

    window.valueUpdater.start();
    startStopwatch();
    loadQuestions().then(() => { console.log("Questions loaded, starting game..."); scheduleNextQuestion() }).catch(err => console.error("Error loading questions:", err));
    }
}

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
    const randomDelay = Math.random() * (30000 - 10000) + 1000; // Random delay between 10 and 30 seconds
    console.log(`Scheduling next question in ${(randomDelay / 1000).toFixed(2)} seconds.`);
    setTimeout(triggerEvent, randomDelay);
}


async function triggerEvent() {
    const keys = Object.keys(questions);

    // Safety check: if no questions exist, stop here
    if (keys.length === 0) {
        console.error("No questions found in the script variable.");
        return false;
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const q = questions[randomKey];
    var options = q.options;

    // 1. Map to objects to keep track of original indices
    let indexedItems = options.map((value, index) => ({ value, originalIndex: index }));

    // 2. Fisher-Yates Shuffle
    for (let i = indexedItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedItems[i], indexedItems[j]] = [indexedItems[j], indexedItems[i]];
    }

    // 3. Extract the results
    const shuffledValues = indexedItems.map(item => item.value);
    const shuffledIndices = indexedItems.map(item => item.originalIndex);

    console.log("Values:", shuffledValues);  // e.g., [20, 10, 30]
    console.log("Indices:", shuffledIndices); // e.g., [1, 0, 2]

    // FIX: Using BACKTICKS (`) for the template string
    const promptMessage = `${q.text}\n\n` +
        shuffledValues.map((opt, index) => `${index + 1}. ${opt}`).join('\n');

    const choice = prompt(promptMessage, "3");

    applyScoreChange(parseInt(shuffledIndices[choice - 1]) + 1); // Map back to original index and apply score change
    scheduleNextQuestion();
}


function startStopwatch() {
    if (stopWatchInterval) clearInterval(stopWatchInterval);
    startTime = Date.now();
    

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
function applyScoreChange(choice) {
    // Update the target value for the chart
    if (choice === 1) {
        window.valueUpdater.updateTarget(window.valueUpdater.target + 5, 0.05);
    } else if (choice === 2) {
        console.log("Almost correct, no score change.");
    } else if (choice === 3) {
        window.valueUpdater.updateTarget(window.valueUpdater.target - 5, 0.05);
    } else {
        console.log("Invalid choice, no score change.");
    }
    // Update the target value for the chart
    //scheduleNextQuestion();
    return;

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
    if (timerDisplay) {
        timerDisplay.innerText = `Time: ${minutes}:${seconds}`;
    }
}



function buyShares() {
    console.log("Buy shares clicked");
    // Implement buying shares logic here
}
function sellShares() {
    console.log("Sell shares clicked");
    // Implement selling shares logic here
}