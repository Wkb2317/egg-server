const service = require('egg').Service

class user extends  service{
  async updateUser (user) {
    const {ctx,app} = this
    let obj = {}
    if(!user.avatar){
      user.avtar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    }
    return await app.mysql.update('user',{...user},{where: {email: user.email}})


  }
}

module.exports = user