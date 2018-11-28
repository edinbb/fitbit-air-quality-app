import document from "document";
import { PanoramaItem } from "./panorama-item"

export class PanoramaManager {
  constructor(el) {
    this.el = el;
    this.itemEls = this.el.getElementsByClassName("station-item");
    this.dEl = document.getElementById("details");
    this.hEl = document.getElementById("history");
    this.ondata = undefined;
    this.views = [];
  }

  get view() {
    return this.views[this.el.value];
  }

  next() {
    if (this.dEl.style.display === "inline"
      || this.hEl.style.display === "inline") return;
    let curr = this.el.value, total = this.views.length - 1;
    this.el.value = curr === total ? 0 : ++curr;
  }

  previous() {
    if (this.dEl.style.display === "inline"
      || this.hEl.style.display === "inline") return;
    let curr = this.el.value, total = this.views.length - 1;
    this.el.value = curr === 0 ? total : --curr;
  }

  back(evt) {
    if (this.views[this.el.value])
      this.views[this.el.value].back(evt);
  }

  show(content) {
    this.views = [];
    this.itemEls.forEach(item => item.style.display = "none"); //cleanup
    for (let i = 0; i < content.stations.length; i++) {
      this.views.push(new PanoramaItem(this.itemEls[i], this.dEl, this.hEl, content.timestamp, content.stations[i]));
      if (content.stations[i]) this.ondata(content.stations[i].name);
    }
    this.el.value = 0; //redraw 
    this.views.forEach(view => view.load());
  }
}