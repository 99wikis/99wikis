class DefaultException extends Error {
  constructor(code, messages, httpCode) {
    super();

    this.code = code;
    this.httpCode = httpCode;
    this.messages = messages;
  }
}

module.exports = DefaultException;
