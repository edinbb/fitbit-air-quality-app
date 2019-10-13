import { units } from "user-settings";
import { gettext } from "i18n";

export function formatDistance(value) {
  if (isNaN(value)) return "";
  let unit = units.distance == "us" ? "mi" : "km";
  let distance = units.distance == "us" ? value : value*1.609344;
  if (unit == "mi" && distance > 10) return `> 10${unit}`;
  if (unit == "km" && distance > 20) return `> 20${unit}`;
  return `${distance.toFixed(2)}${unit}`;
}

export function ease(t, b, v, d) {
  let c = v > 300 ? Math.floor(300 * 1) : Math.floor(v * 1);
  return c * ((t = t / d - 1) * Math.pow(t, 2) + 1) + b;
}

export function timestampConverter(timestamp) {
  if (!timestamp) return "--";
  let secs = Math.floor((Date.now() - timestamp) / 1000);
  if (secs < 60) return "0" + getLocText("minute");
  let hours = Math.floor(secs / 3600);
  if (hours > 0) return ">1" + getLocText("hour");
  return `${Math.floor(secs / 60)}${getLocText("minute")}`;
}

export function barAttr(val) {
  let ret = { y: 11, height: 100 };
  let c = val > 300 ? ret.height : Math.ceil(val * (ret.height / 300));
  ret.y = ret.y + ret.height - c;
  ret.height = c;
  return ret;
}

export function getLocText(key) {
  let str = gettext(key);
  let args = [].slice.call(arguments, 1);
  for (let i = 0; i < args.length; i++) {
    str = str.replace(`{${i}}`, args[i]);
  }
  return str;
}