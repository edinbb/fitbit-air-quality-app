import { localStorage } from "local-storage";
import { settingsStorage } from "settings";
import { AqicnAPI } from './aqicn-api';
import { getLocation } from "./modules/location-helper";
import { SettingsError } from "./errors";
import * as stationHistory from "./station-history"
import { get } from "./modules/settings-companion";
import { CONFIG } from "./appconfig";
import { HISTORY_KEY } from "../common/const";

export class AqicnService {
  constructor() {
    this.api = new AqicnAPI(CONFIG.token);
    this.onresolve = undefined;
    this.onreject = undefined;
    settingsStorage.addEventListener("change", evt => {
      if (evt.key === "location"
        || evt.key === "stations"
        || evt.key === "trackHistory"
        || evt.key === "wakeInterval")
        this.getData(false);
    });
  }

  getData(checkOverdue) {
    let metadata = this.createMetadata();
    if (checkOverdue) {
      if (this.isDue(metadata))
        this.refreshData(metadata);
    } else {
      this.refreshData(metadata);
    }
  }

  refreshData(metadata) {
    let promises = [];
    if (metadata.nearby) {
      getLocation()
        .then((loc) => {
          promises.push(this.api.nearbyStation(loc));
          metadata.stations.forEach((st) => promises.push(this.api.cityStation({ uid: st.uid })));
          Promise.all(promises).then((stations) => {
            if (metadata.history && metadata.wakeInterval !== 0) {
              try {
                stationHistory.track(stations);
              } catch (e) {
                console.error(e.message);
                this.onreject({ type: "history", message: e.message });
              }
            } else {
              if (localStorage.getItem(HISTORY_KEY))
                localStorage.removeItem(HISTORY_KEY);
            }
            this.onresolve({ timestamp: metadata.timestamp, stations: stations });
            this.saveTimestamp(metadata.timestamp);
          }).catch((e) => {
            console.error(e.message);
            this.onreject(e);
          });
        })
        .catch((e) => {
          this.onreject(e);
        });
    } else {
      metadata.stations.forEach((st) => promises.push(this.api.cityStation({ uid: st.uid })));
      Promise.all(promises).then((stations) => {
        if (metadata.count === 0) throw new SettingsError("Stations not selected!");
        if (metadata.history && metadata.wakeInterval !== 0) {
          try {
            stationHistory.track(stations);
          } catch (e) {
            console.error(e.message);
            this.onreject({ type: "history", message: e.message });
          }
        } else {
          if (localStorage.getItem(HISTORY_KEY))
            localStorage.removeItem(HISTORY_KEY);
        }
        this.onresolve({ timestamp: metadata.timestamp, stations: stations });
        this.saveTimestamp(metadata.timestamp);
      }).catch((e) => {
        console.error(e.message);
        this.onreject(e);
      });
    }
  }

  createMetadata() {
    let metadata = {};
    metadata.nearby = get("location") === null ? false : get("location");
    metadata.stations = get("stations") || [];
    metadata.history = get("trackHistory") === null ? true : get("trackHistory");
    metadata.wakeInterval = get("wakeInterval").values[0].value;
    metadata.count = metadata.nearby ? metadata.stations.length + 1 : metadata.stations.length;
    metadata.timestamp = Date.now();
    return metadata;
  }

  saveTimestamp(timestamp) {
    try {
      localStorage.setItem("timestamp", JSON.stringify(timestamp));
    } catch (e) {
      console.warn(e);
    }
  }

  isDue(metadata) {
    try {
      let timestamp = JSON.parse(localStorage.getItem("timestamp"));
      if (!timestamp || Date.now() - timestamp > metadata.wakeInterval) return true;
    } catch (e) {
      console.warn(e);
      return true;
    }
    return false;
  }
}