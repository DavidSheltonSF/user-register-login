const ok = (data) => {
  return {
    status: 200,
    data,
    error: null,
  };
};

const badRequest = (message) => ({
  status: 400,
  data: null,
  error: message,
});

const unauthorized = (message = 'Unauthorized') => ({
  status: 401,
  data: null,
  error: message,
});

const forbidden = (message = 'Forbidden') => ({
  status: 403,
  data: null,
  error: message,
});

const notFound = (message = 'Resource not found') => ({
  status: 404,
  data: null,
  error: message,
});

const unprocessableEntity = (message = 'Unprocessable Entity') => {
  return {
    status: 422,
    data: null,
    error: message,
  };
};

const serverError = (message = 'Internal Server Error') => {
  return {
    status: 500,
    deta: null,
    error: message,
  };
};

module.exports = {
  ok,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  unprocessableEntity,
  serverError,
};
