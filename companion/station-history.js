import { localStorage } from "local-storage";
import { HISTORY_KEY, HISTORY_NOD } from "../common/const";

let records;

export function track(stations) {
  records = loadRecords() || [];
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    let index = findRecordIndex(station.id);
    if (index !== null) {
      updateRecord(index, station);
    } else {
      index = createRecord(station);
    }
    station.history = records[index];
  }
  storeRecords();
}

function updateRecord(index, station) {
  if (checkIfSameDay(records[index].timestamp)) {
    updateIAQIs(index, station.iaqis, true);
  } else {
    updateIAQIs(index, station.iaqis, false);
    records[index].timestamp = Date.now();
  }
}

function createRecord(station) {
  let record = {
    id: station.id,
    timestamp: Date.now(),
  };
  let arr = [];
  station.iaqis.forEach(iaqi => {
    arr.push({
      pol: iaqi.pol,
      iaqiHist: [{
        v: Math.ceil(iaqi.val),
        l: iaqi.level,
        d: new Date().getDate()
      }]
    });
  });
  record.iaqis = arr;
  return records.push(record) - 1;
}

function updateIAQIs(index, iaqis, sameDay) {
  let record = records[index];
  for (let i = 0; i < iaqis.length; i++) {
    const iaqi = iaqis[i];
    let recordIaqi;
    let k = 0;
    while (k < record.iaqis.length) {
      if (iaqi.pol === record.iaqis[k].pol)
        recordIaqi = record.iaqis[k];
      k++
    }
    if (recordIaqi) {
      if (sameDay) { //just update max values for the same day
        let lastDay = recordIaqi.iaqiHist[recordIaqi.iaqiHist.length - 1];
        let newValue = Math.ceil(iaqi.val);
        if (newValue > lastDay.v) {
          lastDay.v = newValue;
          lastDay.l = iaqi.level;
        }
      } else {
        recordIaqi.iaqiHist.push({
          v: Math.ceil(iaqi.val),
          l: iaqi.level,
          d: new Date().getDate()
        });
      }
      if (recordIaqi.iaqiHist.length > HISTORY_NOD)
        recordIaqi.iaqiHist.shift(); //keep only HISTORY_NOD number of days
    } else {
      if (!record.iaqis) record.iaqis = [];
      record.iaqis.push({
        pol: iaqi.pol,
        iaqiHist: [{
          v: Math.ceil(iaqi.val),
          l: iaqi.level,
          d: new Date().getDate()
        }]
      });
    }
  }
}

function findRecordIndex(stationId) {
  let k = 0;
  while (k < records.length) {
    if (stationId === records[k].id)
      return k;
    k++;
  }
  return null;
}

function checkIfSameDay(timestamp) {
  return new Date(timestamp).getDate() === new Date().getDate();
}

function loadRecords() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY));
}

function storeRecords() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}