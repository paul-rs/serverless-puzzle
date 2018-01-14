export default class MockConfig {
    constructor() {
      this.endpoint = 'http://localhost:3000/comments/int';
      this.inbox = 'inbox';
      this.inboxPrefix = 'comments';
      this.localPath = './';
      this.channel = jest.fn();
    }
  }