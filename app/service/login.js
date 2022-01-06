'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
  async login(data) {
    try {
      const res = await this.app.mysql.query('select * from test');
      const userinfo = res.find(item => (item.username === data.username && item.password === data.password));
      return userinfo;
    } catch (error) {
      return null;
    }
  }

  async getall() {
    try {
      const res = await this.app.mysql.query('select * from test');
      return res;
    } catch (error) {
      return null;
    }
  }
}

module.exports = LoginService;

