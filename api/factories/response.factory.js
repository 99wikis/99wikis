const ResponseFactory = () => {
  const defaultResponseObject = () => ({
    code: null,
    messages: null,
  });

  const fail = (code, errorMessages = null) => {
    const responseObject = defaultResponseObject();

    responseObject.code = code;
    responseObject.messages = errorMessages;

    return responseObject;
  };

  const success = (responseData = null) => responseData;

  return {
    fail,
    success,
  };
};

module.exports = ResponseFactory();
