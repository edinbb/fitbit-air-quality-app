import * as fs from "fs";
import { locale } from "user-settings";

const DIR_PATH = "resources/locales/";

let defLocale, userLocale, localized_strings;

export function init(defaultLocale) {
  defLocale = defaultLocale;
  userLocale = locale.language;
  localized_strings = {};

  try {
    localized_strings = fs.readFileSync(`${DIR_PATH}${userLocale}.json`, "json");
  } catch (e) {
    console.warn("Fallback to default locale!");
    localized_strings = fs.readFileSync(`${DIR_PATH}${defLocale}.json`, "json");
  }
}

export function _(key) {
  let str = localized_strings[key] || key;
  var args = [].slice.call(arguments, 1);
  args.forEach((arg, i) => str = str.replace(`{${i}}`, arg));
  return str;
}