const start = document.getElementById('start-btn');
let isRunning = false;

while (!isRunning) {
    start.addEventListener('click', () => {
        isRunning = true;
        start.classList.add('d-none');
        const canvas = document.getElementById('game-canvas');
        canvas.classList.remove('d-none');
        // Initialize and start the game here


    })}