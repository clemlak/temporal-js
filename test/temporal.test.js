/* eslint-env mocha */

const fs = require('fs');
const { assert } = require('chai');
const Temporal = require('..');
const Utils = require('./utils');

describe('Temporal JS API', () => {
  let temporal;
  let username;
  let email;
  let password;
  let token;
  let keyName;
  let savedHash;
  const hashToPin = 'QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE';
  const hashToDownload = 'Qmct5P3seR6o5kSanpcebR2FbAGFcN5qGRwvwqegQ4DVuj';

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

  it('Should publish a message to the given pubsub topic', () => temporal.publishPubSubMessage('foo', 'bar')
    .then((res) => {
      assert.equal(res.topic, 'foo', 'Topic is wrong');
      assert.equal(res.message, 'bar', 'Message is wrong');
    }));

  it('Should upload a public file', () => temporal.uploadPublicFile(
    fs.createReadStream('./test/test.txt'),
    5,
  )
    .then((res) => {
      assert.isString(res, 'Res is not a string');
      savedHash = res;
    }));

  it('Should pin a new hash', () => temporal.pin(hashToPin, 5));

  it('Should get the stats of some hash', () => temporal.getObjectStat(hashToPin)
    .then((stats) => {
      assert.hasAllKeys(stats, ['Hash', 'BlockSize', 'CumulativeSize', 'DataSize', 'LinksSize', 'NumLinks'], 'Keys are wrong');
      assert.equal(stats.Hash, hashToPin, 'Hash is wrong');
    }));

  it('Should get the dag from some hash', () => temporal.getDag(hashToPin)
    .then((dag) => {
      assert.hasAllKeys(dag, ['data', 'links'], 'Keys are wrong');
      assert.isArray(dag.links, 'Links is not an array');

      for (let i = 0; i < dag.links.length; i += 1) {
        assert.hasAllKeys(dag.links[i], ['Cid', 'Name', 'Size'], 'Keys are wrong');
      }
    }));

  it('Should download the file from some hash', () => temporal.download(hashToDownload)
    .then((file) => {
      file.pipe(fs.createWriteStream('./test/test.jpg'));
    }));
});
