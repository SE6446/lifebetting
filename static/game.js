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
    loadQuestions().then(() => { console.log("Questions loaded, starting game..."); scheduleNextAction(triggerEvent) }).catch(err => console.error("Error loading questions:", err));
    }
    scheduleNextAction(shortSqueeze, [60000, 120000]); // Schedule first short squeeze between 1-2 minutes
}


async function loadQuestions() {
    try {
        const response = await fetch('./questions.json');
        if (!response.ok) throw new Error("File not found");
        questions = await response.json();
        console.log("Questions loaded successfully:", questions);
        return true;
    } catch (err) {
        console.error("Fetch failed. Use a local server (Live Server).", err);
        return false;
    }
}

function renderScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `${parseInt(score)}`;
    }
}

let isShortSqueezeActive = false; // Track if a short squeeze is currently active
async function shortSqueeze(){
    console.log("Short squeeze triggered!");
    isShortSqueezeActive = true;
    window.valueUpdater.addVolatility(0.5); // Increase volatility during the short squeeze
    alert("Short squeeze! People don't have faith in you! Prove them wrong! You have 30 seconds to beat the strike price!");
    const shortStrike = window.valueUpdater.currentValue;
    triggerEvent(); // Hit'em with the old one-two, a double whammy of questions to really mess with their head during the squeeze. The first one is a freebie, the second one is the real kicker. - Who ever the AI is.
    triggerEvent();
    triggerEvent(); 
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds
    const finalValue = window.valueUpdater.currentValue;
    const finalDifference = finalValue - shortStrike;
    alert(`Short squeeze ended! Final value: ${finalValue.toFixed(2)}. You were ${finalDifference >= 0 ? 'above' : 'below'} the strike price of ${shortStrike.toFixed(2)}.`);
    score += finalDifference; // To make big monies, we weaponise your vindication.
    renderScore();
    window.valueUpdater.addVolatility(-0.5); // Reduce but don't reset as we want a more volatile game until mistakes can be ruinous
    isShortSqueezeActive = false; // Mark that the short squeeze is no longer active
    scheduleNextAction(shortSqueeze, [60000, 120000]); // Schedule next short squeeze between 1-2 minutes
}

function scheduleNextAction(event, timerange = [10000, 30000]) {
    const randomDelay = Math.random() * (timerange[1] - timerange[0]); // Random delay between the specified range
    console.log(`Scheduling next question in ${(randomDelay / 1000).toFixed(2)} seconds.`);
    setTimeout(event, randomDelay);
    
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

    //console.log("Values:", shuffledValues);   
    //console.log("Indices:", shuffledIndices); NO CHEATING!

    
    const promptMessage = `${q.text}\n\n` +
        shuffledValues.map((opt, index) => `${index + 1}. ${opt}`).join('\n');

    const choice = prompt(promptMessage, "3");

    applyScoreChange(parseInt(shuffledIndices[choice - 1]) + 1);
    scheduleNextAction(triggerEvent);
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
    const factor = isShortSqueezeActive ? 10 : 5; // More impact during short squeeze
    if (choice === 1) {
        window.valueUpdater.updateTarget(window.valueUpdater.target + factor, 0.05);
        score += 1;
    } else if (choice === 2) {
        console.log("Almost correct, no score change.");
    } else if (choice === 3) {
        window.valueUpdater.updateTarget(window.valueUpdater.target - factor, 0.05);
        score -= 1;
    } else {
        console.log("Invalid choice, no score change.");
    }
    renderScore();
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