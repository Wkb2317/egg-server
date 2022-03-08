'use strict'

const Controller = require('egg').Controller

class LoginController extends Controller {
  // 发送验证码
  async sendLoginCode() {
    const { ctx } = this
    const { email } = ctx.query
    if (email) {
      const res = await ctx.service.tools.sendMail(email, '程序设计题库验证码')
      // console.log(res)
      res ? ctx.body = {
        code: 1, msg: '验证码发送成功'
      } : ctx.body = {
        code: 0, msg: '邮箱不能为空'
      }
      return ctx.body
    }

  }

  // 登录
  async login() {
    const { ctx } = this
    const userInfo = ctx.request.body
    const isLogin = await ctx.service.login.login(userInfo)

    if (isLogin) {
      const options = userInfo.autoLogin ? { expiresIn: '12h' } : { expiresIn: '60h' }
      let token = this.app.jwt.sign(JSON.parse(JSON.stringify(userInfo)), this.app.config.jwt.secret, options)
      return ctx.body = {
        code: 1, msg: 'ok', token, currentAuthority: 'admin'
      }
    }
    return ctx.body = {
      code: 0, msg: 'error'
    }
  }

  // 当前用户
  async getCurrentUser() {
  }

  // 退出登录
  async loginOut() {
    const { userEmail } = this.ctx.request.body
    const res = await this.ctx.service.login.loginOut( userEmail )
    if( res ) {
      this.ctx.body = {
        code: 1,
        msg: 'ok'
      }
    } else {
      this.ctx.body = {
        code: 0,
        msg: '退出失败'
      }
    }
  }
}

module.exports = LoginController
