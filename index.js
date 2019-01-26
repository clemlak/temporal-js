/* eslint-disable class-methods-use-this */

const axios = require('axios');
const querystring = require('querystring');

class Temporal {
  constructor() {
    this.token = '';
  }

  register(username, email, password) {
    return axios.post(
      'https://dev.api.temporal.cloud/v2/auth/register',
      querystring.stringify({
        username,
        email_address: email,
        password,
      }),
    )
      .then(res => res.data.response)
      .catch(err => err.response.data.response);
  }

  login(username, password) {
    return axios({
      method: 'post',
      url: 'https://dev.api.temporal.cloud/v2/auth/login',
      data: {
        username,
        password,
      },
    })
      .then(res => res.data)
      .catch(err => err.response.data.message);
  }
}

module.exports = Temporal;
