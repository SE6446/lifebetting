// 1. Initialize data buffers (X = time, Y = value)
const now = Date.now() / 1000; // uPlot expects seconds, not ms
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
  scales: {
    x: { time: true } // Tells uPlot to format X as dates
  }
};

// 3. Create the instance
let u = new uPlot(opts, data, document.body);

// 4. The update function
function addDataPoint(value) {
  const now = Date.now() / 1000; // uPlot expects seconds, not ms
  
  xData.push(now);
  yData.push(value);

  // Keep a window of 100 points
  if (xData.length > 100) {
    xData.shift();
    yData.shift();
  }

  // Efficiently update the chart
  u.setData(data);
}

window.addEventListener('resize', () => {
  u.setSize(container.offsetWidth, 400);
});

class ValueUpdater {
  constructor(interval, initialtarget) {
    this.target = initialtarget; // Starting value, can be adjusted based on game logic
    this.currentValue = initialtarget; // This will fluctuate around the target
    this.updateInterval = interval; // Update every second
    this.isRunning = false;
    this.precision = 0.1; // Precision for value fluctuations
  }

  updateTarget(newTarget, precision = 0.1) {
    console.log(`Updating target from ${this.target} to ${newTarget}`);
    this.target = newTarget;
    this.precision = precision;
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
      const newValue = this.currentValue + ((this.target - this.currentValue) * this.precision) + fluctuation;
      this.currentValue = newValue;
      addDataPoint(newValue);
      await new Promise(resolve => setTimeout(resolve, this.updateInterval));
    }
    }
    stop() {
    this.isRunning = false;
  }

}