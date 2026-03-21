console.log("1. Script file reached"); // This should show immediately

//window.onload = function() {
//    console.log("2. Window loaded");
//
//    const startBtn = document.getElementById('start-btn');
//    console.log("3. Button element:", startBtn);
//
//    if (!startBtn) {
//        console.error("STOP: 'start-btn' not found in HTML. Check your IDs.");
//        return;
//    }
//
//    startBtn.addEventListener('click', () => {
//        console.log("4. Button click detected!");
//        // ... rest of your code
//    });
//};

let questions = {};
let score = 0;
let startTime;
let elapsedTime = 0;
let stopWatchInterval;

function initializeGame() {
    let currentScore = 10;
    window.valueUpdater = new ValueUpdater(150, 50);
    console.log("Initializing game...");
    window.valueUpdater.start();
    triggerEvent();
    loadQuestions();
}

async function fetchQuestions() {
    try {
        const questions = await fetch('questions.json');
        questions = await questions.json();
        scheduleNextQuestion(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

    function scheduleNextQuestion() {
        const randomDelay= Math.floor(Math.random() * (3000-1000) + 1000);
        setTimeout(triggerEvent, randomDelay);
}

async function triggerEvent() {
    if (!window.questions || Object.keys(window.questions).length === 0) {
    const keys = Object.keys(questions);
    randomKey = keys[Math.floor(Math.random() * keys.length)];
    const q = questions[randomKey];

    const prompt = `Question: ${question.question}\nOptions:\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`;
    const choice = prompt(prompt);
       if (choice === "1") {
        applyScoreChange('correct');
    } else if (choice === "2") {
        applyScoreChange('almost correct');
    } else if (choice === "3") {
        applyScoreChange('incorrect');
    }
    score.updateUI();
    scheduleNextQuestion();
}
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
            score.updateUI ();
            scheduleNextQuestion();
            return;
        
     }



    }
    
    function startStopwatch() {
        clearInterval(stopWatchInterval);
        startTime = Date.now();
        stopWatchInterval = setInterval(() => {
            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById('stopwatch').textContent = `Time: ${elapsedTime}s`;
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