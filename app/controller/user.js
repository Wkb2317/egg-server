const Controller = require('egg').Controller

class user extends  Controller{
  async updateUser () {
    const {ctx,app} = this
    let res = await  ctx.service.user.updateUser(ctx.request.body)
    return ctx.body  = {
      code : 1,
      msg: 'ok'
    }
  }
}

module.exports = user