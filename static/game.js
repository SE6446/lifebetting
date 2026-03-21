const startBtn = document.getElementById('start-btn');
const canvas = document.getElementById('game-canvas');
const ctx = document.getElementById('marketChart').getContext('2d');

let isRunning = false;
let gameChart; // We define this here so we can update it later
let score = 0;

// 1. The Trigger: Everything starts when this is clicked
startBtn.addEventListener('click', () => {
    isRunning = true;
    
    startBtn.classList.add('d-none');
    canvas.classList.remove('d-none');

    // 2. Initialize the Chart
    gameChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0], // Start with one point
            datasets: [{
                label: 'CURRENCY_VALUE',
                data: [0], 
                borderColor: '#ffcc00', // Dispatches Yellow
                backgroundColor: 'rgba(255, 204, 0, 0.1)',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: {
                    grid: { color: '#222' },
                    ticks: { color: '#ffcc00', font: { weight: 'bold' } }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
startRealTimeGameLoop();
startQuestionsTimer();
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