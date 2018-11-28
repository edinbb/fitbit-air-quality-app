import { memory } from "system";

export function init() {
  getReading();
  setInterval(getReading, 10000);
}

function getReading() {
  console.log(`JS memory: ${memory.js.used}/${memory.js.peak}/${memory.js.total}`);
  console.log(`Native memory: ${memory.native.used}/${memory.native.peak}/${memory.native.total}`);
  console.log(`Memory pressure: ${memory.monitor.pressure}`);
}