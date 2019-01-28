/* eslint-disable class-methods-use-this */

const axios = require('axios');
const querystring = require('querystring');
const rp = require('request-promise-native');

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

  pin(hash, holdTime) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/ipfs/public/pin/${hash}`,
      data: querystring.stringify({
        hold_time: holdTime,
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

  uploadPublicFile(file, holdTime) {
    const options = {
      method: 'POST',
      uri: `${this.endpoint}/${this.version}/ipfs/public/file/add`,
      formData: {
        hold_time: holdTime,
        file,
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    return rp(options)
      .then((res) => {
        const json = JSON.parse(res);

        return json.response;
      })
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  getObjectStat(hash) {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/ipfs/public/stat/${hash}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  getDag(hash) {
    return axios({
      method: 'get',
      url: `${this.endpoint}/${this.version}/ipfs/public/dag/${hash}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data.response)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  download(hash) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/ipfs/utils/download/${hash}`,
      data: querystring.stringify({
        network_name: '',
      }),
      responseType: 'stream',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(res => res.data)
      .catch((err) => {
        throw new Error(err.response.data.response);
      });
  }

  publishDetails(hash, lifetime, ttl, key, resolve) {
    return axios({
      method: 'post',
      url: `${this.endpoint}/${this.version}/ipns/public/publish/details`,
      data: querystring.stringify({
        hash,
        life_time: lifetime,
        ttl,
        key,
        resolve,
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
