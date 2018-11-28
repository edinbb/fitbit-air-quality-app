import { LEVELS, POL_INT } from "./locales/en";
import { timestampConverter } from "./utils";

export class DetailsScreen {
  constructor(el) {
    this.details = el;
    this.onhistory = undefined;
    this.onclose = undefined;
    this.scrollView = this.details.getElementById("container");
    this.detailsName = this.details.getElementById("name-text");
    this.detailsSampleTime = this.details.getElementById("sample-time-text");
    this.detailsAttribution = this.details.getElementById("attribution-text");
    this.detailsRefreshTime = this.details.getElementById("refresh-time-text");
    this.detailsIAQIs = this.details.getElementsByClassName("iaqi-section");
    this.detailsIAQIs.forEach(el => {
      el.firstChild.text = "";
      el.firstChild.nextSibling.text = "";
    });
    this.btnHistory = this.details.getElementById("button-history");
    this.btnClose = this.details.getElementById("button-close");
    this.btnHistory.onclick = (evt) => this.onhistory();
    this.btnClose.onclick = (evt) => this.onclose();
  }

  load(data, timestamp) {
    this.detailsName.text = data.name;
    data.iaqis.forEach((iaqi, i) => {
      let el = this.detailsIAQIs[i];
      let polEl = el.firstChild;
      let valEl = polEl.nextSibling;
      polEl.text = POL_INT[iaqi.pol] || "";
      valEl.text = iaqi.val;
      valEl.style.fill = LEVELS[iaqi.level].color;
    });
    this.detailsRefreshTime.text = `Updated ${timestampConverter(timestamp)} ago`;
    this.detailsAttribution.text = `Data Source: ${data.url}`;
    this.detailsSampleTime.text = `Sampled on ${data.time || ""}`;
  }

  show() {
    this.details.animate("enable");
  }

  hide() {
    this.details.animate("disable");
    this.scrollView.value = 0;
  }

  isVisible() {
    return this.details.style.display === "inline";
  }
}