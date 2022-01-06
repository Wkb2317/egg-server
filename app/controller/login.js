'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async login() {
    const { ctx } = this;

    const userinfo = await ctx.service.login.login(ctx.request.body);
    let token = null;

    if (userinfo) {
      token = this.app.jwt.sign(JSON.parse(JSON.stringify(userinfo)), this.app.config.jwt.secret, { expiresIn: '60s' });
      console.log(token);
    }
    const res = token ? { token, code: '200' } : { code: '304' };
    ctx.body = res;
  }

  async getall() {
    this.ctx.body = await this.ctx.service.login.getall();
  }
}

module.exports = LoginController;
