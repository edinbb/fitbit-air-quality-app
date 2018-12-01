import { LEVELS } from "../common/const";
import { _ } from "./modules/i18n"
import { timestampConverter } from "./utils";

export class DetailsScreen {
  constructor(el) {
    this.details = el;
    this.onhistory = undefined;
    this.onclose = undefined;
    this.scrollView = this.details.getElementById("container");
    this.detailsName = this.details.getElementById("name-text");
    this.detailsTitle = this.details.getElementById("title-text");
    this.detailsSampledTime = this.details.getElementById("sample-time-text");
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
    this.detailsTitle.text = _("monitoring_station");
    data.iaqis.forEach((iaqi, i) => {
      let el = this.detailsIAQIs[i];
      let polEl = el.firstChild;
      let valEl = polEl.nextSibling;
      polEl.text = _(iaqi.pol);
      valEl.text = iaqi.val;
      valEl.style.fill = LEVELS[iaqi.level].color;
    });
    this.detailsRefreshTime.text = _("updated", timestampConverter(timestamp));
    this.detailsAttribution.text = _("attribution", data.url);
    this.detailsSampledTime.text = _("sampled_time", data.time);
    this.btnHistory.getElementById("text").text = _("history");
    this.btnClose.getElementById("text").text = _("close");
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