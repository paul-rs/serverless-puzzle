import CommentsRepository from "../src/commentsS3Repository";
import configureContainer from "../src/compositionRoot";
import AWS from "aws-sdk-mock";
import fs from "fs";

jest.mock("../src/compositionRoot");
jest.mock("fs");

const container = configureContainer();
const testData = { id: 1, body: "test comment" };
const mockUpload = jest.fn();

beforeEach(() => {
  AWS.mock("S3", "getObject", (params, callback) => {
    callback(null, { Body: JSON.stringify(testData) });
  });

  AWS.mock("S3", "upload", (params, callback) => {
    mockUpload(); //a hack to create a spy on AWS.S3.upload
    callback(null, null);
  });
});

afterEach(() => {
  AWS.restore("S3");
});

afterAll(() => {
  jest.unmock("../src/compositionRoot.js");
  jest.unmock("fs");
});

test("test get returns data", async () => {
  const repository = new CommentsRepository({
    config: container.resolve("config")
  });
  const comment = await repository.get("key");
  expect(comment.body).toBe(testData.body);
});

test("test put creates file", async () => {
  const repository = new CommentsRepository({
    config: container.resolve("config")
  });
  repository.put(testData);
  const spy = jest.spyOn(fs, "writeFile");
  expect(spy).toHaveBeenCalled();
});

test("test put uploads to s3", async () => {
  const repository = new CommentsRepository({
    config: container.resolve("config")
  });
  const fsSpy = jest.spyOn(fs, "createReadStream");
  repository.put(testData);

  expect(fsSpy).toHaveBeenCalled();
  expect(mockUpload).toHaveBeenCalled();
});
