const startBtn = document.getElementById('start-btn');
const canvas = document.getElementById('game-canvas');
const ctx = document.getElementById('marketChart').getContext('2d');
import { ValueUpdater } from './render.js';

let gameChart; // We define this here so we can update it later
let score = 0;

const valueUpdater = new ValueUpdater(1000, 100); // Update every second, starting at 100

// 1. The Trigger: Everything starts when this is clicked
startBtn.addEventListener('click', () => {
    valueUpdater.start();
    
    startBtn.classList.add('d-none');
    canvas.classList.remove('d-none');
});


// Function to update the chart whenever points are earned
function updateMarket(points) {
    score += points;
    
    // Add new data to chart
    gameChart.data.labels.push(gameChart.data.labels.length);
    gameChart.data.datasets[0].data.push(score);
    
    // Keep it looking like a "moving" stock ticker (last 20 points)
    if (gameChart.data.labels.length > 20) {
        gameChart.data.labels.shift();
        gameChart.data.datasets[0].data.shift();
    }
    
    gameChart.update();

 
}