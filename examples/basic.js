const fs = require('fs');

const Temporal = require('..');
const Utils = require('../test/utils');

const temporal = new Temporal();

const username = Utils.randomString();
const email = `${username}@test.com`;
const password = Utils.randomString();

temporal.register(username, email, password)
  .then(() => {
    console.log('User is registered!');

    return temporal.login(username, password);
  })
  .then(() => {
    console.log('User is logged in!');

    return temporal.generateIpfsKey('rsa', '2018', 'test');
  })
  .then(() => {
    console.log('IPFS key is being generated!');

    return temporal.getIpfsKeys();
  })
  .then((res) => {
    console.log(res);

    return temporal.uploadPublicFile(
      fs.createReadStream('./examples/hello.txt'),
      5,
    );
  })
  .then((res) => {
    console.log('File has been saved at:', res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
