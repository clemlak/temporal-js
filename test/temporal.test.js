/* eslint-env mocha */

const { assert } = require('chai');
const Temporal = require('..');
const Utils = require('./utils');

describe('Temporal', () => {
  let temporal;
  let username;
  let email;
  let password;
  let token;
  let keyName;

  before(() => {
    username = Utils.randomString();
    email = `${Utils.randomString()}@email.com`;
    password = Utils.randomString();
  });

  it('Should create a new instance of the Temporal library', () => {
    temporal = new Temporal();
  });

  it('Should create a new account', () => temporal.register(
    username,
    email,
    password,
  )
    .then((account) => {
      assert.isObject(account, 'Response is not an object');
      assert.equal(account.UserName, username, 'Username is wrong');
      assert.equal(account.EmailAddress, email, 'Email is wrong');
    }));

  it('Should login the user', () => temporal.login(
    username,
    password,
  )
    .then((res) => {
      ({ token } = res);

      assert.isObject(res, 'Response is not an object');
    }));

  it('Should return the username from the token', () => temporal.getUsernameFromToken()
    .then((res) => {
      assert.equal(res, username, 'Username is wrong');
    }));

  it('Should return the available credits of the user', () => temporal.getCredits()
    .then((credits) => {
      assert.isNumber(credits, 'Credits is not a number');
    }));

  it('Should generate a new IPFS key', () => temporal.generateIpfsKey('rsa', '2018', 'test'));

  it('Should get the IPFS keys', () => temporal.getIpfsKeys()
    .then((res) => {
      assert.hasAllKeys(res, ['key_ids', 'key_names'], 'Keys are not present');
      [keyName] = res.key_names;
    }));

  it('Should export the key', () => temporal.exportKey(keyName)
    .then((mnemonic) => {
      assert.isArray(mnemonic, 'Mnemonic is not an array');
    }));
});
