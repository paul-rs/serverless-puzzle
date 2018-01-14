import request from "r2";

export default class Config {
  constructor() {
    this.endpoint = process.env.ENDPOINT;
    this.inbox = process.env.INBOX;
    this.inboxPrefix = process.env.PREFIX;
    this.localPath = process.env.LOCALPATH;
    this.channel = request; // workaround for circular dependency in container
  }
}
