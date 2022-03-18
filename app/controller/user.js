const Controller = require('egg').Controller

class user extends Controller {
  // 更新用户信息
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

//  登录积分
  async getLoginIntegration () {
    const {ctx,app} = this
    const uuid = ctx.request.query.uuid
    if(uuid) {
       await  ctx.service.user.getLoginIntegration(uuid)
    } else {
      return ctx.body = {
        code: 0,
        msg: '请传递uuid'
      }
    }
  }

//  积分记录
  async getIntegrationHistory(){
    const {ctx,app} = this
    const uuid = ctx.request.query.uuid
    if(uuid) {
      await  ctx.service.user.getIntegrationHistory(uuid)
    } else {
      return ctx.body = {
        code: 0,
        msg: '请求失败 ！'
      }
    }
  }

}

module.exports = user