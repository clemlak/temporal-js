const Temporal = require('..');

const temporal = new Temporal();

/*
temporal.register('clem2', 'clem2@test.com', 'hello')
  .then((res) => {
    console.log('Registred!', res);

    return temporal.login('clem2', 'hello');
  })
  .then((res) => {
    console.log('Logged in', res);

    return temporal.generateIpfsKey('rsa', '2018', 'test');
  })
  .then((res) => {
    console.log(res);

    return temporal.getIpfsKeys();
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
*/

temporal.login('clem2', 'hello')
  .then(() => temporal.getIpfsKeys())
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
