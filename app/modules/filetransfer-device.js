import { inbox } from "file-transfer";

let ftCallback;

export function initialize(callback) {
  ftCallback = callback;
  inbox.onnewfile = () => processFiles();
  processFiles();
}

function processFiles() {
  let filename;
  while (filename = inbox.nextFile()) {
    console.log(`File ${filename} is processed!`);
    ftCallback(filename);
  }
}