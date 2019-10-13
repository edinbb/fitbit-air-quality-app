import { me } from "companion"
import { device } from "peer";
import * as messaging from "messaging";
import * as cbor from 'cbor';
import { AqicnService } from "./aqicn-service";
import { enqueueFile } from "./modules/filetransfer-companion";
import * as appSettings from "./modules/settings-companion";
import * as appAnalytics from "./modules/ga-companion";
import { CONFIG } from "./appconfig";
import { FILENAME_DATA } from "../common/const";

if (!device.screen) device.screen = { width: 348, height: 250 };
if (!appSettings.get("imageWidth")) appSettings.set("imageWidth", device.screen.width);
if (!appSettings.get("imageHeight")) appSettings.set("imageHeight", device.screen.height);
if (!appSettings.get("wakeInterval")) appSettings.set("wakeInterval", CONFIG.wakeInterval);
if (appSettings.get("trackHistory") === null) appSettings.set("trackHistory", CONFIG.enableTracking);
if (!appSettings.get("token")) appSettings.set("token", CONFIG.token);

appAnalytics.initialize(`${device.screen.width}x${device.screen.height}`);

let service = new AqicnService();
service.onresolve = (data) => enqueueFile(FILENAME_DATA, cbor.encode(data));
service.onreject = (e) => {
  let msg = {
    errType: e.type || "generic",
    message: e.message || "Something went wrong."
  };
  appAnalytics.trackException(`${msg.errType}Error`);
  appAnalytics.trackException(`${msg.message}`);
  if (msg.errType === "history") return;
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    messaging.peerSocket.send(msg);
};

messaging.peerSocket.onopen = () => {
  console.warn("Socket is ready!");
  appSettings.initialize(() => appAnalytics.trackScreen("settings"));
};

let granted = me.permissions.granted("run_background");
me.wakeInterval = granted ? appSettings.get("wakeInterval").values[0].value : undefined;
if (me.launchReasons.wokenUp || me.launchReasons.settingsChanged) {
  service.getData(false);
}

if (me.launchReasons.peerAppLaunched) {
  service.getData(true);
  appAnalytics.trackEvent("lifecycle", "start", "companion", 0);
}