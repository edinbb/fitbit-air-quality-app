import { FetchError, DataError } from "./errors";
import { StationData } from "./station-data";

export class AqicnAPI {
  constructor(token) {
    this._baseUrl = "https://api.waqi.info/feed";
    this._token = token;
    this._retries = 8; //fetch() retry counter
    this._retry = 0;
  }

  cityStation(uid) {
    return new Promise((resolve, reject) => {
      this._retry = 0;
      this._fetch("/@uid", uid)
        .then(json => resolve(new StationData(json, null).map()))
        .catch(ex => reject(ex));
    });
  }

  nearbyStation(loc) {
    return new Promise((resolve, reject) => {
      this._retry = 0;
      this._fetch("/geo:lat;lon", loc)
        .then(json => resolve(new StationData(json, loc).map()))
        .catch(ex => reject(ex));
    });
  }

  _fetch(endUrl, params) {
    let url = this._baseUrl + endUrl;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        url = url.replace(key, params[key]);
      }
    }
    url = url + "/?token=" + this._token;
    return fetch(url)
      .then(resp => resp.json())
      .then(json => {
        if (json.status === "error" || json.status === "nug")
          throw new DataError("Data status prop is error or nug");
        return json;
      }).catch(ex => {
        if (this._retry < this._retries) {
          console.warn(`Temporary error - ${ex}`);
          this._retry++;
          return this._fetch(endUrl, params);
        } else {
          console.error(`Permanent error - ${ex}`);
          if (ex.type) throw ex;
          throw new FetchError("Failed to fetch!");
        }
      });
  }
}