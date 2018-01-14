export default class CommentsS3Repository {
  constructor({ config }) {
    this.config = config;
    this.data = new Map();
  }

  async get(key, bucket = this.config.inbox) {
    return this.data.get(key);
  }

  async put(comment, bucket = this.config.inbox) {
    this.data.set(comment.id, comment);
  }
}
