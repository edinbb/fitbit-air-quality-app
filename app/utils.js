import { units } from "user-settings";

export function formatDistance(value) {
  if (isNaN(value)) return "";
  if (value > 50) return "TOO FAR";
  let s = "mi";
  if (units.distance !== "us") {
    value *= 1.609344;
    s = "km";
  }
  return `${value.toFixed(2)}${s}`;
}

export function ease(t, b, v, d) {
  let c = v > 300 ? Math.floor(300 * 1) : Math.floor(v * 1);
  return c * ((t = t / d - 1) * Math.pow(t, 2) + 1) + b;
}

export function timestampConverter(timestamp) {
  if (!timestamp) return "--";
  let secs = Math.floor((Date.now() - timestamp) / 1000);
  if (secs < 60) return "0m";
  let hours = Math.floor(secs / 3600);
  if (hours > 0) return ">1h";
  return `${Math.floor(secs / 60)}m`;
}

export function barAttr(val) {
  let ret = { y: 11, height: 100 };
  let c = val > 300 ? ret.height : Math.ceil(val * (ret.height / 300));
  ret.y = ret.y + ret.height - c;
  ret.height = c;
  return ret;
}