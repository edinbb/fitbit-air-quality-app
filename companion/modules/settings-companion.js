import * as cbor from 'cbor';
import { Image } from "image";
import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { enqueueFile } from "./filetransfer-companion";
import { FILENAME_JPG } from "../../common/const";

let onSettingsCallback;

export function initialize(callback) {
  onSettingsCallback = callback;
  restoreSettings();
  settingsStorage.addEventListener("change", evt => updateSettings(evt));
}

export function get(key) {
  return JSON.parse(settingsStorage.getItem(key));
}

export function set(key, value) {
  settingsStorage.setItem(key, JSON.stringify(value));
}

function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (!key) continue;    
    let data = { key: key };
    if (key === "backgroundImage") {
      data.newValue = "set";
    } else {
      data.newValue = get(key);
    }
    sendValue(data);
  }
}

function updateSettings(evt) {
  onSettingsCallback();
  let data = { key: evt.key };
  if (evt.key === "backgroundImage" && evt.newValue) {
    sendImage(evt.newValue);
    data.newValue = "set";
  } else if (evt.key === "backgroundImage" && !evt.newValue) {
    data.newValue = "remove";
  } else {
    data.newValue = JSON.parse(evt.newValue);
  }
  sendValue(data);
};

function sendImage(data) {
  const imageData = JSON.parse(data);
  Image.from(imageData.imageUri)
    .then((image) => image.export("image/jpeg", { quality: 40 }))
    .then((buffer) => enqueueFile(FILENAME_JPG, cbor.encode(buffer)));
}

function sendValue(val) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    messaging.peerSocket.send(val);
}