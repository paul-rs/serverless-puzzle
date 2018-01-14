import AWS from "aws-sdk";
import fs from "fs";
import uuid from "node-uuid";
import path from "path";
import promisify from "util-promisify";

const writeFile = promisify(fs.writeFile);

/*  Repository class for persisting comments into S3 */
export default class CommentsS3Repository {
  constructor({ config }) {
    this.config = config;
    this.s3 = new AWS.S3();
  }

  /*
      Gets a comment from S3
      @param key: the s3 object key (includes prefixes)
      @param bucket: the bucket name where comments are stored. If not provided,
      the configured bucket will be used
  */
  async get(key, bucket = this.config.inbox) {
    const s3Object = await this.s3
      .getObject({ Bucket: bucket, Key: key })
      .promise();
    return JSON.parse(s3Object.Body.toString("utf-8"));
  }

  /*
      Saves a comment as a file and then persists the file to S3.
      @param comment: the comment object to be persisted
      @param bucket: the bucket name where the comment will be stored. If not provided,
      the configured bucket will be used
      @returns: the s3 object key of the upload comment
  */
  async put(comment, bucket = this.config.inbox) {
    const filename = `${uuid.v4()}.json`;
    const filepath = path.join(this.config.localPath, filename);
    const key = `${this.config.inboxPrefix}/${filename}`;

    console.info("Writing local file to ", filename);
    await writeFile(filepath, JSON.stringify(comment, null, 2));

    try {
      console.info("Uploading to s3");
      const params = {
        Bucket: bucket,
        Key: key,
        Body: fs.createReadStream(filepath)
      };

      await this.s3.upload(params).promise();
      return key;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }
}
