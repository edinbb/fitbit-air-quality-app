import { outbox } from "file-transfer";

export function enqueueFile(filename, data) {
  outbox.enqueue(filename, data)
    .then((ft) => console.log(`File ${filename} enqueued in the outbox!`))
    .catch((err) => console.warn(`Error during enqueuing: ${err}`));
}