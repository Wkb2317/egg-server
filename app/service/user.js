const service = require('egg').Service

class user extends  service{
  async updateUser (user) {
    const {ctx,app} = this
    return await app.mysql.update('user',{...user},{where: {email: user.email}})
  }
}

module.exports = user