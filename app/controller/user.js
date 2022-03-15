const Controller = require('egg').Controller

class user extends Controller {
  //更新用户信息
  async updateUser() {
    const { ctx, app } = this
    try {
     await ctx.service.user.updateUser(ctx.request.body)
    } catch (e) {
      console.log(e)
      return ctx.body = {
        code: 0,
        mag: 'error'
      }
    }
  }

 // 注册
  async register(){
    const { ctx } = this
    const res = await  ctx.service.user.register(ctx.request.body)
    // console.log(res)
  }

  // 更新密码
  async updatePassword(){
    const { ctx } = this
    const res = await ctx.service.user.updatePassword(ctx.request.body)
    return res
  }
}

module.exports = user