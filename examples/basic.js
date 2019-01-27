const Temporal = require('..');

const temporal = new Temporal();

temporal.register('jasper12222', 'jasper12222@test.com', 'hello')
  .then((res) => {
    console.log('Registred!', res);

    return temporal.login('jasper12222', 'hello');
  })
  .then((res) => {
    console.log('Logged in', res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });

/*
temporal.login('meh2', 'hello')
  .then((res) => {
    console.log(res);

    return temporal.generateIpfsKey('rsa', '2018', 'test');
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log('Error', err);
  });
*/
