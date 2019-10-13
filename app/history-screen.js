import { barAttr, getLocText } from "./utils";
import { LEVELS } from "../common/const";

export class HistoryScreen {
  constructor(el) {
    this.history = el;
    this.historyVL = this.history.getElementById("history-list");
    this.onback = undefined;
  }

  load(data) {
    let listArr = [{
      type: "history-header-pool",
      value: data.name,
      title: getLocText("hist_data")
    }];
    if (!data.history
      || !data.history.iaqis
      || data.history.iaqis.length === 0) {
      listArr.push({
        type: "empty-message-pool",
        value: getLocText("empty_message")
      });
    } else {
      data.history.iaqis.forEach(iaqi => {
        listArr.push({
          type: "history-iaqi-pool",
          iaqi: iaqi
        });
      });
    }
    listArr.push({
      type: "history-button-pool",
      self: this
    });
    this.historyVL.delegate = {
      getTileInfo: function (index) {
        return listArr[index];
      },
      configureTile: function (tile, info) {
        if (info.type === "empty-message-pool")
          tile.getElementById('text').text = info.value;
        if (info.type === "history-header-pool") {
          tile.getElementById('text').text = info.value;
          tile.getElementById('title').text = info.title;
        }
        if (info.type === "history-button-pool") {
          let btnEl = tile.getElementById('button');
          btnEl.getElementById("text").text = getLocText("back");
          btnEl.onclick = (evt) => info.self.onback();
        }
        if (info.type === "history-iaqi-pool") {
          let polEl = tile.getElementById("history-iaqi-pol");
          let barsEl = tile.getElementsByClassName("chart-bar");
          polEl.text = getLocText(info.iaqi.pol);
          barsEl.forEach((el, i) => {
            el.style.display = "none";
            let histData = info.iaqi.iaqiHist[i];
            if (histData) {
              el.style.display = "inline";
              let axisValue = el.firstChild;
              let barFront = axisValue.nextSibling;
              axisValue.text = getLocText(histData.d);
              let barRectAttr = barAttr(histData.v);
              barFront.y = barRectAttr.y;
              barFront.height = barRectAttr.height;
              let color = LEVELS[histData.l].color;
              barFront.style.fill = color;
            }
          });
        }
      }
    };
    this.historyVL.length = listArr.length;
    for (let i = 0; i < this.historyVL.length; i++)
      this.historyVL.updateTile(i, { redraw: false });
    this.historyVL.redraw();
  }

  show() {
    this.history.animate("enable");
  }

  hide() {
    this.history.animate("disable");
    this.historyVL.value = 0;
  }

  isVisible() {
    return this.history.style.display === "inline";
  }
}