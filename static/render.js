// 1. Initialize data buffers (X = time, Y = value)
const now = Date.now() / 1000; // uPlot expects seconds, not ms
let xData = [now]; // Start with a single timestamp (e.g., now)
let yData = [10]; // Start with some initial values, currently set to 10 as that's approixmately how valuable you are if we disassembled your atoms.
let data = [xData, yData];

// 2. Configure the chart
const opts = {
  title: "Life Betting - Real-Time Value Chart",
  id: "lifeChart",
  width: 800,
  height: 400,
  series: [
    {}, // The X-series (timestamps)
    {
      label: "Value",
      stroke: "dodgerblue",
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