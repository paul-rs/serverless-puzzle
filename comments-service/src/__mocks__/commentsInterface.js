export default class CommentsInterface {
  constructor({ config }) {
    this.config = config;
  }

  async get(id) {
    if (id == 1) {
      return {
        postId: 1,
        id: 1,
        name: "Test",
        email: "Eliseo@gardner.biz",
        body: "This is a test"
      };
    } else return {};
  }
}
