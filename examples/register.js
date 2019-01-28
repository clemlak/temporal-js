const Temporal = require('..');

const temporal = new Temporal();

const rand = Math.random().toString(36).substring(2, 15);

temporal.register(rand, `${rand}@email.com`, 'password')
  .then((res) => {
    console.log('Registred!', res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
