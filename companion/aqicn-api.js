import { FetchError, DataError } from "./errors";
import { StationData } from "./station-data";

export class AqicnAPI {
  constructor(token) {
    this.baseUrl = "https://api.waqi.info/feed";
    this.token = token;
  }

  async cityStation(uid) {
    let json = await this.fetch("/@uid", uid);
    return new StationData(json, null).map();
  }

  async nearbyStation(loc) {
    let json = await this.fetch("/geo:lat;lon", loc);
    return new StationData(json, loc).map();
  }

  async fetch(endUrl, params) {
    let retries = 5; //fetch() retry counter
    let url = this.baseUrl + endUrl;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        url = url.replace(key, params[key]);
      }
    }
    url = url + "/?token=" + this.token;
    try {
      let error;
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`Fetching station data...`);
          let response = await fetch(url);
          let json = await response.json();
          if (json.status === "error" || json.status === "nug")
            throw new DataError("Data status prop is error or nug");
          return json;
        } catch (e) {
          console.warn(`Temporary error - ${e}`);
          error = e;
        }
      }
      throw error;
    } catch (e) {
      console.error(`Permanent error - ${e}`);
      if (e.type) throw e;
      throw new FetchError("Failed to fetch!");
    }
  }
}