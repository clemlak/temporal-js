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
      .then(res => res.data)
      .catch((err) => {
        console.log(err);
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
      .catch(err => err.response.data.message);
  }

  generateIpfsKey(keyType, keyBits, keyName) {
    return axios({
      method: 'post',
      url: 'https://dev.api.temporal.cloud/v2/account/key/ipfs/new',
      data: querystring.stringify({
        key_type: keyType,
        key_bits: keyBits,
        key_namee: keyName,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((res) => {
        if (res.data.response !== 'key creation sent to backend') {
          error(res.data.reponse);
        }
      })
      .catch(err => err.response.data.response);
  }
}

module.exports = Temporal;
