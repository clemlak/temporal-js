/* eslint-disable class-methods-use-this */

const axios = require('axios');
const querystring = require('querystring');

class Temporal {
  constructor() {
    this.endpoint = 'https://dev.api.temporal.cloud';
    this.version = 'v2';

    this.token = '';
  }

  register(username, email, password) {
    return axios.post(
      `${this.endpoint}/${this.version}/auth/register`,
      querystring.stringify({
        username,
        email_address: email,
        password,
      }),
    )
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  login(username, password) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/auth/login`,
      data: {
        username,
        password,
      },
    })
      .then((res) => {
        this.token = res.data.token;

        return res.data;
      })
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  getUsernameFromToken() {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/account/token/username`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  getCredits() {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/account/credits/available`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  refreshAuthToken() {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/auth/refresh`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  generateIpfsKey(keyType, keyBits, keyName) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/account/key/ipfs/new`,
      data: querystring.stringify({
        key_type: keyType,
        key_bits: keyBits,
        key_name: keyName,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  getIpfsKeys() {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/account/key/ipfs/get`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  exportKey(keyName) {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/account/key/export/${keyName}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  publishPubSubMessage(topic, message) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/ipfs/public/pubsub/publish/${topic}`,
      data: querystring.stringify({
        message,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }
}

module.exports = Temporal;
