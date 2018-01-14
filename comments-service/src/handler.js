import configureContainer from "./compositionRoot";

export const container = configureContainer();

/*
    GET baseurl/comments/{id}
    Request a comment
    API Gateway method that fetches a comment from an external service and stores it in S3

    @pathParam id: the numeric id of the comment
    @returns: The comment in JSON format
*/
export const getComment = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const commentsInterface = container.resolve("commentsInterface");
  let response = {};

  try {
    const comment = await commentsInterface.get(id);
    const repository = container.resolve("commentsRepository");
    await repository.put(comment);

    response = { statusCode: 200, body: JSON.stringify(comment) };
  } catch (error) {
    console.error(error.message);
    response = { statusCode: 504, body: error.message };
  }
  callback(null, response);
};

/*
    Pure lambda function triggered by S3 notifications during object creation.
    The comment is read and logged in Cloudwatch.
*/
export const parseComment = async (event, context, callback) => {
  const record = event.Records[0];
  const repository = container.resolve("commentsRepository");
  const comment = await repository.get(
    record.s3.object.key,
    record.s3.bucket.name
  );

  console.info(comment);
  callback(null, null);
};
