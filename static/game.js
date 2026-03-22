console.log("1. Script file reached"); // This should show immediately

let questions = {};
let score = 0;
let elapsedTime = 0;
let stopWatchInterval;
const sfx = new Audio('assets/wall_street_opening.mp3');
loadQuestions().then(() => { console.log("Questions loaded");});
const startBtn = document.getElementById("start-btn");

function toggleGame() {
    if (!window.valueUpdater){
        window.valueUpdater = new ValueUpdater(150, 50);
    }
    console.log("Toggling game...");
    window.valueUpdater.addEventListener("appStopped", (event) => {
        stopStopwatch();
        alert(`Game over! Achieved a score of ${score}`);
        resetStopwatch();
    });
    if (!window.valueUpdater.isRunning) {
        sfx.play().catch(error => {
            console.error("Error playing sound:", error);
        });

        window.valueUpdater.start();
        startBtn.textContent = "Pause Game"
        startStopwatch();
        scheduleNextAction(triggerEvent)
        scheduleNextAction(shortSqueeze, [120000, 180000]); // Schedule first short squeeze between 2-3 minutes
    } else {
        stopStopwatch();
        window.valueUpdater.stop() // Stop the value updater loop
        console.log("Game stopped.");
        startBtn.textContent = "Start Game"
    }
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

/**
 * Prompts us to update the score clientside
 */
function renderScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `${parseInt(score)}`;
    }
}

let isShortSqueezeActive = false; // Track if a short squeeze is currently active

/**
 * Short Squeeze is an event where the opps short your life! Don't let it happen!
 * @returns void
 */
async function shortSqueeze(){
    if (!window.valueUpdater.isRunning) return;

    console.log("Short squeeze triggered!");
    isShortSqueezeActive = true;
    window.valueUpdater.addVolatility(0.5); // Increase volatility during the short squeeze
    alert("Short squeeze! People don't have faith in you! Prove them wrong! You have 30 seconds to beat the strike price!");
    const shortStrike = window.valueUpdater.currentValue;
    //triggerEvent(); // Hit'em with the old one-two, a double whammy of questions to really mess with their head during the squeeze. The first one is a freebie, the second one is the real kicker. - Who ever the AI is.
    //triggerEvent();
    //triggerEvent(); 
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds
    const finalValue = window.valueUpdater.currentValue;
    const finalDifference = finalValue - shortStrike;
    alert(`Short squeeze ended! Final value: ${finalValue.toFixed(2)}. You were ${finalDifference >= 0 ? 'above' : 'below'} the strike price of ${shortStrike.toFixed(2)}.`);
    score += finalDifference; // To make big monies, we weaponise your vindication.
    renderScore();
    window.valueUpdater.addVolatility(-0.45); // Reduce but don't reset as we want a more volatile game until mistakes can be ruinous
    isShortSqueezeActive = false; // Mark that the short squeeze is no longer active
    scheduleNextAction(shortSqueeze, [60000, 120000]); // Schedule next short squeeze between 1-2 minutes
}

function scheduleNextAction(event, timerange = [10000, 30000]) {
    const randomDelay = Math.random() * (timerange[1] - timerange[0]); // Random delay between the specified range
    console.log(`Scheduling next question in ${(randomDelay / 1000).toFixed(2)} seconds.`);
    setTimeout(event, randomDelay);
    
}

/**
 * A function to prompt the user for a question.
 * @returns void
 */
async function triggerEvent() {
    if (!window.valueUpdater.isRunning) return;
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

    const choice = await asyncPrompt(promptMessage, "3");

    applyScoreChange(parseInt(shuffledIndices[choice - 1]) + 1);
    scheduleNextAction(triggerEvent);
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




let stopwatchInterval = null;
let startTime = null;

/**
 * Starts the stopwatch. 
 * If it's already running, it restarts it.
 */
function startStopwatch() {
    // Clear any existing interval to prevent "leaking" memory or multiple loops
    //if (stopwatchInterval) {
    //    clearInterval(stopwatchInterval);
    //}

    startTime = Date.now();

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
            //timerElement.classList.add('text-white');
        }
    }, 1000);
}

/**
 * Stops the stopwatch and clears the interval.
 */
function stopStopwatch() {
    if (stopwatchInterval) {
        stopwatchInterval = null; // Reset variable for cleanliness
        console.log("Stopwatch stopped.");
    }
}

/**
 * reset's the Stopwatch, in theory startStopwatch does this but this forces the webpage to reset to zero before starting a new stopwatch
 */
function resetStopwatch() {
    stopStopwatch();
    clearInterval(stopWatchInterval)
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerText = "00:00";
        //timerElement.classList.remove('text-white');
    }
}

async function asyncPrompt(message) {
    console.debug(message)
    const dialog = document.getElementById('BigChoices');
    const pTag = document.getElementById("promptText");
    const input = document.getElementById('promptInput');

    // 1. Reset the input and dialog state from any previous calls
    input.value = '';
    dialog.returnValue = '';
    
    pTag.style.color = "var(--text-amber)";
    pTag.textContent = message;
    // Listen for the Enter key on the input field
    input.onkeydown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Stop it from clicking "Cancel"
            dialog.close("default"); // Force the dialog to close with success
        }
    };
    return new Promise((resolve) => {
        dialog.showModal(); 
  
        dialog.onclose = () => {
            // 3. Check which button closed the dialog
            if (dialog.returnValue === "default") {
                resolve(input.value); // User clicked Confirm
            } else {
                resolve(null); // User clicked Cancel or pressed Escape
            }
        };
    });
}
