'use strict'
const Controller = require('egg').Controller
const await = require('await-stream-ready/lib/await')
const dayjs = require('dayjs')

class TestController extends Controller {
  async connect() {
    const { ctx, app } = this
    const userId = ctx.query.id
    const socketId = ctx.args[0]
    try {
      const sql = `update user set socketId = '${socketId}' where id = '${userId}'`
      await app.mysql.query(sql)
    } catch (e) {
      console.log(e)
    }
  }

  async getMessage() {
    const { ctx, app } = this
    const { to_id, from_id, message } = JSON.parse(ctx.args[0])
    try {
      const findUserInfoSql = `select socketId,name,avatar,id from user where id = '${to_id}' or id = '${from_id}'`
      const res = await app.mysql.query(findUserInfoSql)
      let fromUserInfo = {}
      let toUserInfo = {}
      if (res[0].id === from_id) {
        fromUserInfo = res[0]
        toUserInfo = res[1]
      } else {
        fromUserInfo = res[1]
        toUserInfo = res[0]
      }
      const time =  dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (res.length) {
        // 转发消息
        ctx.socket.to(toUserInfo.socketId).emit('getMessage', {
          to_id,
          from_id,
          message,
          from_user_avatar: fromUserInfo.avatar,
          from_user_name: fromUserInfo.name,
          to_user_avatar: toUserInfo.avatar,
          to_user_name: toUserInfo.name,
          time,
          is_read: 'false'
        })
      }

      // 入库
      const insert_sql = `insert into messages (from_id,to_id,time,message,from_user_name,from_user_avatar,to_user_name,to_user_avatar,is_read) values ('${from_id}','${to_id}','${time}','${message}','${fromUserInfo.name}','${fromUserInfo.avatar}','${toUserInfo.name}','${toUserInfo.avatar}','${false}')`
      await app.mysql.query(insert_sql)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = TestController
