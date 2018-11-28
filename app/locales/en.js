export const ERROR_MSG = {
  "fetch": "Unable to get data from the data provider. Check your Internet connection or try restarting the app.",
  "data": "The data is temporarily unavailable. Please try again later.",
  "content": "The station data is corrupted and unreadable. Please try again later or select a different station.",
  "settings": "Nothing to show. Go to App Settings in the App Gallery and select monitoring stations.",
  "location": "Unable to acquire your current location. Enable Location services and restart the app.",
  "socket": "Connection error. Get close to your phone and switch the Bluetooth on.",
  "generic": "Sorry, something went wrong. Try restarting the app.",
};

export const LEVELS = {
  "0": { text: "Good", color: "#67E55D" },
  "1": { text: "Moderate", color: "#FFD733" },
  "2": { text: "Sensitive beware", color: "#FC6B3A" },
  "3": { text: "Unhealthy", color: "#F83C40" },
  "4": { text: "Very unhealthy", color: "#800080" },
  "5": { text: "Hazardous", color: "#800000" },
  "-1": { text: "Unknown", color: "fb-light-gray" }
};

export const POL_INT = {
  "pm25": "PM2.5",
  "pm10": "PM10",
  "co": "CO",
  "no2": "NO2",
  "so2": "SO2",
  "o3": "O3",
  "none": "UNKN"
};