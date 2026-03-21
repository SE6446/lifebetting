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

const sfx = new Audio('assets/wall_street_opening.mp3');

function initializeGame() {
    window.valueUpdater = new ValueUpdater(150, 50);
    console.log("Initializing game...");
    if (!window.valueUpdater.isRunning) {
        sfx.play().catch(error => {
            console.error("Error playing sound:", error);
        });
        window.valueUpdater.start();
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