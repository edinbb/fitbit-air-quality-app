let gaCallback;

export function initialize(callback) {
  gaCallback = callback;
}

export function trackException(description) {
  gaCallback({ hit: "exception", description: description });
}

export function trackScreen(screen) {
  gaCallback({ hit: "screenview", screen: screen });
}

export function trackEvent(category, action, label, value) {
  gaCallback({ hit: "event", category: category, action: action, label: label, value: value });
}

export function trackTiming(category, variable, time) {
  gaCallback({ hit: "timing", category: category, variable: variable, time: time });
}