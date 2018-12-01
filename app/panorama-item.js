import { DetailsScreen } from "./details-screen"
import { HistoryScreen } from "./history-screen"
import { ease, formatDistance } from "./utils";
import { _ } from "./modules/i18n"
import { LEVELS } from "../common/const";

export class PanoramaItem {
  constructor(el, dEl, hEl, timestamp, data) {
    this.el = el;
    this.details = dEl;
    this.history = hEl;
    this.timestamp = timestamp;
    this.data = data;
    this.el.style.display = "inline";
    this.status = this.el.getElementById("status-text");
    this.title = this.el.getElementById("title-text");
    this.distance = this.el.getElementById("distance-text");
    this.arcBack = this.el.getElementById("arc-back");
    this.cloudIcon = this.el.getElementById("cloud-icon");
    this.aqi = this.el.getElementById("aqi-text");
    this.pol = this.el.getElementById("pol-text");
    this.name = this.el.getElementById("name-text");
    //arc
    this.arcFront = this.el.getElementById("arc-front");
    this.arcFront.sweepAngle = 0;
    this.time = 0;
    this.dur = 48;
    //el screen touch
    this.touchArea = this.el.getElementById("touch-area");
    this.touchArea.onclick = (evt) => this.showDetails();
    this.detailsScreen = null;
    this.historyScreen = null;
  }

  load() {
    let level = LEVELS[this.data.aqi.level];
    this.status.text = _(level.text);
    this.title.text = _("air_quality");
    this.status.style.fill = level.color;
    this.arcFront.style.fill = level.color;
    this.arcBack.style.fill = level.color;
    this.cloudIcon.style.fill = level.color;
    this.aqi.text = this.data.aqi.val;
    this.pol.text = _(this.data.aqi.pol);
    this.name.text = this.data.name;
    if (this.data.dist) {
      this.distance.text = formatDistance(this.data.dist);
      this.distance.style.display = "inline";
    } else {
      this.distance.text = "";
      this.distance.style.display = "none";
    }
  }

  showDetails() {
    this.detailsScreen = new DetailsScreen(this.details);
    this.detailsScreen.onclose = () => {
      this.detailsScreen.hide();
      this.detailsScreen = null;
    };
    this.detailsScreen.onhistory = () => {
      this.historyScreen = new HistoryScreen(this.history);
      this.historyScreen.onback = () => {
        this.historyScreen.hide();
        this.historyScreen = null;
      };
      this.historyScreen.load(this.data);
      this.historyScreen.show();
    };
    this.detailsScreen.load(this.data, this.timestamp);
    this.detailsScreen.show();
  }

  back(evt) {
    if (this.historyScreen && this.historyScreen.isVisible()) {
      this.historyScreen.hide();
      this.historyScreen = null;
      evt.preventDefault();
      return;
    }
    if (this.detailsScreen && this.detailsScreen.isVisible()) {
      this.detailsScreen.hide();
      this.detailsScreen = null;
      evt.preventDefault();
      return;
    }
  }

  updateArc() {
    if (this.time > this.dur) return;
    if (!this.data) return;
    this.arcFront.sweepAngle = ease(this.time, 0, this.data.aqi.val, this.dur);
    this.time++;
  }
}