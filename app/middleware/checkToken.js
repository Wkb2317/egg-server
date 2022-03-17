'use strict'

function checktoken() {
  return async function(ctx, next) {
    const token = ctx.request.header?.authorization
    const secret = ctx.app.config.jwt.secret
    try {
      const userInfo = ctx.app.jwt.verify(token, secret)
      if (userInfo?.email) {
        await next()
      } else {
        return ctx.body = {
          code: 1, isLogin: false, msg: 'token解析不出来email！'
        }
      }
    } catch (err) {
      return ctx.body = {
        code: 1, isLogin: false, msg: 'token解析异常咯！'
      }
    }
  }
}

module.exports = checktoken
