const Controller = require('egg').Controller

class user extends Controller {
  async updateUser() {
    const { ctx, app } = this
    try {
      let res = await ctx.service.user.updateUser(ctx.request.body)

      return ctx.body = {
        code: 1, msg: 'ok'
      }
    } catch (e) {
      console.log(e)
      return ctx.body = {
        code: 0,
        mag: 'error'
      }
    }

  }
}

module.exports = user