'use strict'

function checktoken() {
  return async function(ctx, next) {
    const token = ctx.request.header?.authorization
    const secret = ctx.app.config.jwt.secret
    try {
      const userInfo = ctx.app.jwt.verify(token, secret)
      if (userInfo?.code) {
        // return ctx.body = {
        //   isLogin: true,
        //   name: '程序猿',
        //   avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        //   userid: '00000001',
        //   email: 'antdesign@alipay.com',
        //   country: 'China',
        //   access: 'admin',
        //   address: '西湖区工专路 77 号',
        //   phone: '0752-268888888'
        // }
        await next()
      } else {
        return ctx.body = {
          code: 1, isLogin: false, msg: '你还没有登录！'
        }
      }
    } catch (err) {
      console.log(err)
      return ctx.body = {
        code: 1, isLogin: false, msg: '你还没有登录！'
      }
    }
  }
}

module.exports = checktoken
