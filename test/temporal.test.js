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
      token = res.token;
      
      assert.isObject(res, 'Response is not an object');
    }));
});