'use strict'

const Controller = require('egg').Controller

class LoginController extends Controller {
  // 发送验证码
  async sendLoginCode() {
    const { ctx } = this
    const { email } = ctx.query
    if (email) {
      const res = await ctx.service.tools.sendMail(email, '程序设计题库验证码')
      return res
    }

  }

  // 登录
  async login() {
    const { ctx } = this
    const userInfo = ctx.request.body
    const isLogin = await ctx.service.login.login(userInfo)

    if (isLogin) {
      const options = userInfo.autoLogin ? { expiresIn: '60h' } : { expiresIn: '12h' }
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
    const { ctx, app } = this
    const token = ctx.request.header?.authorization
    let userInfo = null
    try {
      userInfo = ctx.app.jwt.verify(token, app.config.jwt.secret)
    } catch (e) {
        return ctx.body= {
          code: 0,
          msg: 'token校验失败',
          isLogin: false
        }
    }

    const res = await ctx.service.login.getUserInfo(userInfo.email)

    if(res !== null){
      res.isLogin = true
    }else {
      res.isLogin =  false
    }
    // console.log(res)
    return ctx.body = res
  }

  // 退出登录
  async loginOut() {
    const { userEmail } = this.ctx.request.body
    const res = await this.ctx.service.login.loginOut(userEmail)
    if (res) {
      this.ctx.body = {
        code: 1, msg: 'ok'
      }
    } else {
      this.ctx.body = {
        code: 0, msg: '退出失败'
      }
    }
  }
}

module.exports = LoginController
