const Temporal = require('..');

const temporal = new Temporal();


temporal.register('bob2019', 'bob2019@bob.co', 'password')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

temporal.login('bob2019', 'password')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
