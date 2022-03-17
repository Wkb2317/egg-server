const service = require('egg').Service
const { v4: uuid } = require('uuid')
const dayjs = require('dayjs')

class user extends service {
  async updateUser(user) {
    const { ctx, app } = this
    if (!user.avatar) {
      user.avtar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    }

    try {
      await app.mysql.update('user', { ...user }, { where: { email: user.email } })
      const userinfo = await app.mysql.get('user', { email: user.email })
      userinfo.isLogin = true
      return ctx.body = {
        code: 1, msg: '修改成功', data: userinfo
      }
    } catch (e) {
      return ctx.body = {
        code: 0, msg: '修改失败'
      }
    }

  }

  async updatePassword(userinfo) {
    const { ctx, app } = this
    try {
      const res = await app.mysql.update('user', { password: userinfo.password }, { where: { email: userinfo.email, code: userinfo.code } })
      console.log(res)
      if (res.changedRows && res.affectedRows) {
        return ctx.body = {
          code: 1, msg: '密码修改成功！'
        }
      } else if (res.affectedRows && !res.changedRows) {
        return ctx.body = {
          code: 2, msg: '密码不能和上次相同！'
        }
      } else {
        return ctx.body = {
          code: 3, msg: '邮箱或验证码错误！'
        }
      }
    } catch (e) {
      console.log('修改密码异常')
      return ctx.body = {
        code: 0, msg: '服务器异常'
      }
    }

  }

  async register(userinfo) {
    const { ctx, app } = this
    try {
      const options = {
        id: uuid(), email: userinfo.email, registerTime: dayjs()
          .format('YYYY-MM-DD HH:mm:ss'), integration: 0, password: userinfo.password, avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
      const res = await app.mysql.insert('user', options)

      if (res.changedRows === 0 && res.affectedRows === 1) {
        return ctx.body = {
          code: 1, msg: '注册成功！'
        }
      } else if (res.changedRows === 0 && res.affectedRows === 0) {
        return ctx.body = {
          code: 2, msg: '注册失败'
        }
      }
    } catch (e) {
      return ctx.body = {
        code: 0, msg: '账号已存在'
      }
    }

  }

  async getLoginIntegration(uuid) {
    // console.log(uuid)
    const { ctx, app } = this
    try {

      const res = await app.mysql.query(`select * from integration where id = '${uuid}' and time like '${dayjs().format('YYYY-MM-DD')}%'`,[])
      console.log(res)
      if (Object.keys(res).length) {
        return ctx.body = {
          code: 0, msg: '今天已经登录过了哦'
        }

      } else {
        await app.mysql.insert('integration', {
          id: uuid, value: 1, type: 'login', time: dayjs()
            .format('YYYY-MM-DD HH:mm:ss')
        })
        const userinfo = await app.mysql.get('user', { id: uuid })
        await app.mysql.update('user', { integration: userinfo.integration + 1 }, {where:{ id: uuid }})
        return ctx.body = {
          code: 1, msg: '积分喜加一！'
        }
      }
    } catch (e) {
      console.log(e)
      return ctx.body = {
        code: 0, msg: '服务器出问题咯'
      }
    }
  }

}

module.exports = user