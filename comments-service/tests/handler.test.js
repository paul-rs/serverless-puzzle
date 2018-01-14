import * as handler from '../src/handler';

jest.mock('../src/compositionRoot');

afterAll(() => jest.unmock('../src/compositionRoot.js'));

test('test getComment returns data', async () => {
  var response;
  const callback = (error, result) => {
    response = result;
  };
  await handler.getComment({ pathParameters: { id: 1 } }, null, callback);

  const comment = JSON.parse(response.body);
  expect(comment.id).toEqual(1);
});

test('test getComment puts data', async () => {
  const callback = async (error, result) => {};
  await handler.getComment({ pathParameters: { id: 1 } }, null, callback);

  const repository = handler.container.resolve('commentsRepository');
  const comment = await repository.get(1);

  expect(comment).not.toBeNull();
  expect(comment.id).toEqual(1);
});

test('test getComment returns 200', async () => {
  var response;
  const callback = (error, result) => {
    response = result;
  };
  await handler.getComment({ pathParameters: { id: 1 } }, null, callback);

  expect(response.statusCode).toEqual(200);
  expect(typeof response.body).toBe('string');
});

test('test getComment returns 504', async () => {
  var response;
  const errorMessage = 'Something went wrong';
  const commentsInterface = handler.container.resolve('commentsInterface');
  commentsInterface.get = async () => {
    throw Error(errorMessage);
  };
  const callback = (error, result) => {
    response = result;
  };

  await handler.getComment({ pathParameters: { id: 1 } }, null, callback);

  expect(response.statusCode).toEqual(504);
  expect(response.body).toEqual(errorMessage);
});

test('test parseComment gets data fromn repository', async () => {
  const event = {
    Records: [{ s3: { object: { key: 1 }, bucket: { name: 'inbox' } } }]
  };
  var response;
  const callback = (error, result) => { response = result; };
  const repository = handler.container.resolve('commentsRepository');
  const spy = jest.spyOn(repository, 'get');
  await handler.parseComment(event, null, callback);
  expect(spy).toHaveBeenCalled();
});

test('test parseComment logs the comment', async () => {
  const spy = jest.spyOn(global.console, 'info');
  const event = {
    Records: [{ s3: { object: { key: 1 }, bucket: { name: 'inbox' } } }]
  };
  var response;
  const callback = (error, result) => { response = result; };
  await handler.parseComment(event, null, callback);
  expect(spy).toHaveBeenCalled();
});
