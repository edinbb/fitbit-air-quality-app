import { ContentError } from "./errors";
import { calculateDistance } from "./utils";

export class StationData {
  constructor(json, loc) {
    if (!json) throw new ContentError("Json is empty!");
    this.json = json;
    this.loc = loc;
    this.isPollutant = (pol) => {
      let pollutants = ["co", "no2", "o3", "pm10", "pm25", "so2"];
      let k = 0;
      while (k < pollutants.length) {
        if (pol === pollutants[k]) return true;
        k++;
      }
      return false;
    };
  }

  map() {
    let o = {};
    let data = this.json.data;
    try {
      o.id = data.idx;
      o.name = data.city.name.split(",")[0].trim();
      o.iaqis = this.cleanIAQIs(data.iaqi);
      o.time = this.formatTime(data.time.s);
      if (isNaN(data.aqi)) {
        if (data.iaqi.pm25) {
          o.aqi = this.formatAQI(data.iaqi.pm25.v, "pm25");
        } else if (data.iaqi.pm10) {
          o.aqi = this.formatAQI(data.iaqi.pm10.v, "pm10");
        } else {
          o.aqi = this.formatAQI(-1);
        }
      } else {
        o.aqi = this.formatAQI(data.aqi, data.dominentpol);
      }
    } catch (e) {
      console.error(e);
      throw new ContentError(e.message || "Data is corrupted!");
    }
    try {
      o.url = data.attributions[data.attributions.length - 1].url.split("/")[2];
    } catch (e) {
      console.warn(e);
      o.url = "";
    }
    if (this.loc !== null) {
      try {
        o.dist = calculateDistance(this.loc.lat, this.loc.lon, data.city.geo[0], data.city.geo[1]);
      } catch (e) {
        console.warn(e);
      }
    }

    return o;
  }

  cleanIAQIs(iaqi) {
    let ret = [];
    if (!iaqi) return ret;
    for (const pol in iaqi) {
      if (iaqi.hasOwnProperty(pol)) {
        if (this.isPollutant(pol)) {
          let aqi = this.formatAQI(iaqi[pol].v, pol);
          ret.push(aqi);
        }
      }
    }
    return ret;
  }

  formatAQI(v, p) {
    let c = Math.floor(v);
    const inRange = (c, min, max) => c >= min && c <= max;
    if (inRange(c, 0, 50)) return { val: v, pol: p, level: 0 };
    if (inRange(c, 51, 100)) return { val: v, pol: p, level: 1 };
    if (inRange(c, 101, 150)) return { val: v, pol: p, level: 2 };
    if (inRange(c, 151, 200)) return { val: v, pol: p, level: 3 };
    if (inRange(c, 201, 300)) return { val: v, pol: p, level: 4 };
    if (c > 300) return { val: v, pol: p, level: 5 };
    return { val: -1, pol: "none", level: -1 };
  }

  formatTime(time) {
    let ret = "--";
    try {
      ret = time ? time.slice(0,-3) : ret;
    } catch (e) {
      console.warn(e);
    }
    return ret;
  }
}