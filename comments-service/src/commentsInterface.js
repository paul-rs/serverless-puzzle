/*  API client for retrieving comments  */
export default class CommentsInterface {
  constructor({ config }) {
    this.config = config;
  }

  /*
      Gets a comment from the configured endpoint.
      @param id: the numeric id of the comment to fetch
  */
  async get(id) {
    const url = `${this.config.endpoint}/${id}`;
    const response = await this.config.channel(url);
    return response ? response.json : response;
  }
}
