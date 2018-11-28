export class FetchError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "fetch";
  }
}

export class DataError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "data";
  }
}

export class ContentError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "content";
  }
}

export class SettingsError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "settings";
  }
}

export class LocationError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "location";
  }
}