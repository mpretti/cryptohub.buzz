const fred = async (url, filename) => {
  const got = require("got");
  const fs = require("fs");

  const responsePromise = got(url);
  const bufferPromise = responsePromise.buffer();

  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise
  ]);

  buff = Buffer.from(buffer, "base64");
  console.log("Writing to file ", filename);
  fs.writeFileSync(filename, buff);

  // `response` is an instance of Got Response
  // `buffer` is an instance of Buffer
  // `json` is an object
};

let url = "http://cryptocompare.com/media/35650717/42.jpg";
fred(url);
