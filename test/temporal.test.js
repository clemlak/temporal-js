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
  let keyName;
  let savedHash;
  const hashToDownload = 'Qmct5P3seR6o5kSanpcebR2FbAGFcN5qGRwvwqegQ4DVuj';
  let newHash = '';

  before(() => {
    username = Utils.randomString();
    email = `${Utils.randomString()}@emailjojo.com`;
    password = Utils.randomString();
  });

  it('Should create a new instance of the Temporal library', () => {
    temporal = new Temporal(false);
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

  it('Should generate a new IPFS key', () => temporal.generateIpfsKey('rsa', '256', Utils.randomString()));

  it('Should get the IPFS keys', () => temporal.getIpfsKeys()
    .then((res) => {
      assert.hasAllKeys(res, ['key_ids', 'key_names'], 'Keys are not present');
      [keyName] = res.key_names;

      assert.isNotEmpty(keyName, 'Key is empty');
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
    1,
  )
    .then((res) => {
      assert.isString(res, 'Res is not a string');
      savedHash = res;
      newHash = res;
    }));

  it('Should pin a new hash', () => temporal.pin(newHash, 1));
  it('Should get the stats of some hash', () => temporal.getObjectStat(newHash)
    .then((stats) => {
      assert.hasAllKeys(stats, ['Hash', 'BlockSize', 'CumulativeSize', 'DataSize', 'LinksSize', 'NumLinks'], 'Keys are wrong');
      assert.equal(stats.Hash, newHash, 'Hash is wrong');
    }));
  it('Should get the dag from some hash', () => temporal.getDag(newHash)
    .then((dag) => {
      assert.hasAllKeys(dag, ['data', 'links'], 'Keys are wrong');
      assert.isArray(dag.links, 'Links is not an array');

      for (let i = 0; i < dag.links.length; i += 1) {
        assert.hasAllKeys(dag.links[i], ['Cid', 'Name', 'Size'], 'Keys are wrong');
      }
    }));
  it('Should download the file from some hash', () => temporal.download(hashToDownload)
    .then((file) => {
      assert.isObject(file, 'File is not an object');
      file.pipe(fs.createWriteStream('./test/test.jpg'));
    }));
  it('Should publish IPNS records to public networks', () => temporal.publishDetails(
    savedHash,
    '24h',
    '24h',
    keyName,
    'false',
  ));
  // this is being buggy
  it.skip('Should upload a directory', () => temporal.uploadDirectory('./test')
    .then((res) => {
      console.log(res);
      assert.isString(res, 'Res is not a string');
    }));
  it('Should extend the pin of the hash', () => temporal.extendPin(newHash, 1));
  it('Should search for a particular file', () => temporal.searchRequest(
    'blockchain',
    [],
    [],
    [],
    [],
    [],
  )
    .then((res) => {
      assert.isArray(res, 'Result is not an array');
    }));
  it('Should submit a file for indexing to the Lens database', () => temporal.indexRequest(savedHash, 'ipld')
    .then((res) => {
      console.log(res);
      assert.hasAllKeys(res, ['name', 'mimeType', 'category'], 'Keys are not present');
    }));
});
