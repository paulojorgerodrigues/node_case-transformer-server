// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here
// const { createServer } = require('node:http');
// import http from 'http';
const http = require('node:http');
const { convertToCase } = require('./convertToCase/convertToCase');
// import http from 'http';

const cases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  const server = http.createServer((req, res) => {
    const reqArr = req.url.split('?');
    const textToconvert = reqArr[0].substring(1);
    const params = new URLSearchParams(reqArr[1]);
    const toCase = params.get('toCase');
    const errors = { errors: [] };

    // headers should be set before sending data
    res.setHeader('Content-Type', 'application/json');

    if (textToconvert === '') {
      errors.errors.push(
        'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      );
    }

    if (toCase === '') {
      errors.errors.push(
        '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      );
    }

    if (
      !cases.find((v, i, a) => {
        return v === toCase;
      })
    ) {
      errors.errors.push(
        'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      );
    }

    if (errors.errors.length > 0) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.write(errors);
      res.end();

      return;
    }

    const ret = convertToCase(textToconvert, toCase);

    res.statusCode = 200;
    res.statusMessage = 'OK';

    res.write(ret);

    res.end();
  });

  return server;
}

module.exports = {
  createServer,
};
