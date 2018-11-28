import * as fs from "fs";
import document from "document";
import * as messaging from "messaging";
import * as fileTransfer from "./modules/filetransfer-device";
import * as appSettings from "./modules/settings-device";
import * as appAnalytics from "./modules/ga-device";
import { PanoramaManager } from "./panorama-manager";
import { ERROR_MSG } from "./locales/en";
import { FILENAME_DATA, FILENAME_TYPE, PATH_TO_IMAGE } from "../common/const";
//import * as appMemory from "./modules/memory";
//appMemory.init();

let background = document.getElementById("background").firstChild;
let manager = new PanoramaManager(document.getElementById("panorama"));
manager.ondata = (name) => appAnalytics.trackEvent("data", "view", name, 0);

appAnalytics.initialize((data) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    messaging.peerSocket.send(data);
});

(function () {
  let content = readFile(FILENAME_DATA, FILENAME_TYPE);
  if (content) {
    showContent(content);
  } else {
    showError({ errType: "settings" });
  }
})();

function settingsCallback(settings) {
  if (settings.backgroundImage) {
    if (settings.backgroundImage === "set") {
      try {
        if (background.href !== PATH_TO_IMAGE)
          background.href = PATH_TO_IMAGE;
      } catch (e) { }
    } else {
      if (background.href !== "")
        background.href = "";
    }
  }
}
appSettings.initialize(settingsCallback);

function transferCallback(filename) {
  if (filename === FILENAME_DATA)
    showContent(readFile(FILENAME_DATA, FILENAME_TYPE));
}
fileTransfer.initialize(transferCallback);

messaging.peerSocket.onopen = () => {
  appAnalytics.trackEvent("lifecycle", "start", "device", 0);
};

messaging.peerSocket.onerror = (err) => {
  showError({ errType: "socket" });
  appAnalytics.trackException("socketError");
};

messaging.peerSocket.addEventListener("message", (evt) => {
  let msg = evt.data;
  if (msg.errType) {
    showError(msg);
    if (msg.errType === "settings") {
      deleteFile(FILENAME_DATA);
    }
  }
});

function showContent(content) {
  hideError();
  try {
    manager.show(content);
    appAnalytics.trackScreen("data");
  } catch (e) {
    console.error(e);
    showError({ errType: "content" });
    appAnalytics.trackException("deviceError");
  }
}

function showError(err) {
  let errScr = document.getElementById("error");
  errScr.getElementById("copy").text = ERROR_MSG[err.errType];
  errScr.animate("enable");
  appAnalytics.trackScreen("error");
}

function hideError() {
  document.getElementById("error").animate("disable");
}

function readFile(filename, type) {
  try {
    return fs.readFileSync(filename, type);
  } catch (e) {
    console.warn(`Failed to read ${filename}!`);
  }
}

function deleteFile(filename) {
  try {
    fs.unlinkSync(filename);
  } catch (e) {
    console.warn(`Failed to delete ${filename}!`);
  }
}

document.onkeypress = (evt) => {
  switch (evt.key) {
    case "up":
      manager.previous();
      break;
    case "down":
      manager.next();
      break;
    case "back":
      manager.back(evt);
      break;
    default:
      return;
  }
};

function update() {
  if (manager.view) manager.view.updateArc();
  requestAnimationFrame(update);
}
requestAnimationFrame(update);