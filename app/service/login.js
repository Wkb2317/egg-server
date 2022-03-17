'use strict'

const Service = require('egg').Service

class LoginService extends Service {
  async login(form) {
    try {
      const res = await this.app.mysql.get('user', { email: form.email, password: form.password })
      if (res) return res
      return false
    } catch (error) {
      return null
    }
  }

  async loginOut(userEmail) {
    try {
      await this.app.mysql.update('user', { code: '' }, {
        where: {
          email: userEmail
        }
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async getUserInfo(email) {
    const res = await this.app.mysql.get('user',{email})
    res.password = ''
    if(res){
      return res
    } else {
      return null
    }
  }


}

module.exports = LoginService

