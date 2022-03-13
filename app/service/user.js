const service = require('egg').Service

class user extends  service{
  async updateUser (user) {
    const {ctx,app} = this
    let obj = {}
    console.log(user)
    Object.entries(user).forEach(item => {
      if(item[1]){
        obj[`${item[0]}`] = item[1]
      }
    })

    return await app.mysql.update('user',{...obj},{where: {email: user.email}})


  }
}

module.exports = user