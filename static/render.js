// 1. Initialize data buffers (X = time, Y = value)
var now = Date.now() / 1000; // uPlot expects seconds, not ms
let xData = []; // Start with a single timestamp (e.g., now)
let yData = []; // Start with some initial values, currently set to 10 as that's approixmately how valuable you are if we disassembled your atoms.
let data = [xData, yData];

// 2. Configure the chart
const opts = {
    title: "Life Betting - Real-Time Value Chart",
    id: "lifeChart",
    width: window.innerWidth * 0.8,
    height: 400,
    series: [
        {}, // The X-series (timestamps)
        {
            label: "Value",
            stroke: "limegreen",
            width: 2,
        }
    ],
    axes: [
        {
            // X-Axis (Timeline)
            stroke: "#FFB300",    // Amber text for labels
            grid: {
                stroke: "#222222", // Subtle dark grey grid lines
                width: 1,
            },
            ticks: {
                stroke: "#333333", // Slightly brighter ticks
            }
        },
        {
            // Y-Axis (Price/Data)
            stroke: "#FFB300",    // Amber text
            grid: {
                stroke: "#222222", // Grid lines
                width: 1,
            },
            ticks: {
                stroke: "#333333",
            }
        }
    ],
    points: {
        show: false,
    },
    scales: {
        x: { time: true } // Tells uPlot to format X as dates
    }
};

// The world's most informative variable name.
let uPlotChart = new uPlot(opts, data, document.getElementById('lifeChart'));

/**
 * 
 * @param {int} value  - The new value to add to the chart, representing the player's current value in the game.
 * @param {int} interval - Effectively DeltaTime, eliminates the stutter in the chart by the freezing during interrogation
 */
function addDataPoint(value, interval) {
    now += 86400 * interval; // Increment time by the specified interval (in days)

    xData.push(now);
    yData.push(value);
    

    // Keep a window of 100 points
    if (xData.length > 100) {
        xData.shift();
        yData.shift();
    }

    // Efficiently update the chart
    uPlotChart.setData(data);
}

function clearChart(){
    xData = [];
    yData = [];
    data = [xData, yData]
    uPlotChart.setData(data)
}

class ValueUpdater extends EventTarget {
    constructor(interval, initialtarget) {
        super()
        this.target = initialtarget; // Starting value, can be adjusted based on game logic
        this.currentValue = initialtarget; // This will fluctuate around the target
        this.baseTarget = initialtarget;
        this.updateInterval = interval; // Update every second
        this.isRunning = false;
        this.precision = 0.1; // Precision for value fluctuations, acts as momentum.
    }

    updateTarget(newTarget, precision = 0.1) {
        console.log(`Updating target from ${this.target} to ${newTarget}`);
        this.target = newTarget;
        
    }
    addVolatility(newMomentum = 0.01) {
        this.precision += newMomentum;
    }

    async start() {
        if (this.isRunning) return; // Prevent multiple intervals
        this.isRunning = true;
        this.run();
    }

    async run() {
        while (this.isRunning) {
            // Simulate value changes with some randomness around the target
            const fluctuation = (Math.random() - 0.5) * 2; // Random value between -1 and 1
            // We boost target value by momentum to make the shortsqueeze more intense, and the time after that...
            const newValue = this.currentValue + (this.target - this.currentValue) * this.precision + fluctuation;
            this.currentValue = newValue;
            addDataPoint(newValue, this.updateInterval / 1000); // Convert ms to seconds for the chart
            if (this.currentValue <= 0){this.end()}
            await new Promise(resolve => setTimeout(resolve, this.updateInterval));
        }
    }
    stop() {
        this.isRunning = false;
    }
    end() {
        this.stop();
        clearChart();
        this.precision = 0.1;
        this.target = this.baseTarget;
        this.currentValue = this.baseTarget;
        const stopEvent = new CustomEvent('appStopped', { 
        detail: { finalValue: this._currentValue } 
        });
        this.dispatchEvent(stopEvent);
    }

}