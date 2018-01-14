import CommentsInterface from "../src/commentsInterface";
import configureContainer from "../src/compositionRoot";

jest.mock("../src/compositionRoot");
var container = configureContainer();

afterAll(() => jest.unmock("../src/compositionRoot.js"));

test("test that API is called", async () => {
  const api = new CommentsInterface({ config: container.resolve("config") });
  const spy = jest.spyOn(api.config, "channel");

  for (let i = 1; i <= 5; i++) {
    api.get(i);
    const expected = `${api.config.endpoint}/${i}`;
    expect(spy).toHaveBeenCalledWith(expected);
  }
});
