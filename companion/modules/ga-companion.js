import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { uuidv4 } from "../utils";
import { CONFIG } from "../appconfig";

const URL = "https://www.google-analytics.com/collect";
let clientId, screenSize, isEnabled;

export function initialize(scr) {
  if (CONFIG.trackingId === "") throw ("Tracking ID is not set! Check appconfig.json!");
  screenSize = scr;
  clientId = getKey("clientId", uuidv4());
  console.log(`Client ID: ${clientId}`);
  isEnabled = getKey("analytics", true);
  messaging.peerSocket.addEventListener("message", (evt) => {
    let msg = evt.data;
    if (!msg.hit) return;
    if (msg.hit === "exception") trackException(msg.description);
    if (msg.hit === "screenview") trackScreen(msg.screen);
    if (msg.hit === "event") trackEvent(msg.category, msg.action, msg.label, msg.value);
    if (msg.hit === "timing") trackTiming(msg.category, msg.variable, msg.time);
  });
  settingsStorage.addEventListener("change", evt => {
    if (evt.key === "analytics") {
      isEnabled = JSON.parse(evt.newValue);
    }
  });
}

export function trackException(description) {
  gaRequest("exception", { exd: description });
}

export function trackScreen(screen) {
  gaRequest("screenview", { cd: screen });
}

export function trackEvent(category, action, label, value) {
  gaRequest("event", { ec: category, ea: action, el: label, ev: value });
}

export function trackTiming(category, variable, time) {
  gaRequest("timing", { utc: category, utv: variable, utt: time });
}

function gaRequest(type, params) {
  if (!isEnabled) return;
  let payload = "v=1"
    + "&tid=" + CONFIG.trackingId
    + "&cid=" + clientId
    + "&sr=" + screenSize
    + "&t=" + type
    + "&an=" + CONFIG.app.name
    + "&av=" + CONFIG.app.version;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      payload += "&" + key + "=" + encodeURIComponent(params[key]);
    }
  }
  fetch(URL, {
    method: "POST",
    headers: { "Content-length": payload.length },
    body: payload
  }).then(resp => console.log(`Google Analytics request - Status: ${resp.status}`))
    .catch(err => console.error(`Google Analytics request - Error: ${err.message}`));
}

function getKey(key, defaultValue) {
  if (!settingsStorage.getItem(key))
    settingsStorage.setItem(key, JSON.stringify(defaultValue));
  return JSON.parse(settingsStorage.getItem(key));
}