import { geolocation } from "geolocation";
import { LocationError } from "../errors.js";

export function getLocation() {
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition((pos) => {
      let loc = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };
      console.log(`Current location (${loc.lat}, ${loc.lon})`);
      resolve(loc);
    }, (err) => {
      console.error(err);
      reject(new LocationError(err.message));
    });
  });
}