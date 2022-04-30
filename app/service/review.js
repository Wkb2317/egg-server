"use strict";

const await = require("await-stream-ready/lib/await");
const Service = require("egg").Service;

class ReviewService extends Service {
  async getNoReviewQuestions() {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query('select * from question  order by time desc')
      ctx.body = {
        code: 1,
        data: res,
        msg: 'ok'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage
      }
    }
  }

  async reviewQuestion({ id,status,mark }) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query(' update  question set status = ?,mark = ? where id = ?', [status,mark,id])
      ctx.body = {
        code: 1,
        data: res,
        msg: 'ok'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage
      }
    }
  }

  async getAllUser({ userId}) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query("select * from user ", [userId])
      res.forEach(item => {
       delete(item.password)
      })
      ctx.body = {
        code: 1,
        data: res,
        msg: 'ok'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage
      }
    }
  }

  async changeUserAccess({ changeUserId, access}) {
    const { ctx, app } = this;
    try {
      let sql = `update user set access = '${access ? 'admin' : 'user'}' where id = '${changeUserId}'`
      const res = await app.mysql.query(sql)
      if (res.affectedRows) {
        ctx.body = {
          code: 1,
          msg: '修改成功'
        }
      } else {
        ctx.body = {
          code: 0,
          msg: '修改失败'
        }
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        msg: '修改失败'
      }
    }
  }

  async getAllCommentAndReply() {
    const { ctx, app } = this;
    try {
      const comment = await app.mysql.query("select c.comment_id,u.id,u.name,u.avatar,u.email,c.content,c.comment_time as time from comment c left join user u on c.user_id = u.ID where c.pass is null")
      const reply = await app.mysql.query("select r.id as reply_id,u.id,u.name,u.avatar,u.email,r.reply_content as content, r.reply_time as time from reply r left join user u on r.from_userId = u.id where r.pass is null")
      const res = [...reply, ...comment]
      res.sort((a, b) => 
        (a.time < b.time ? 1: -1)
      )
      ctx.body = {
        code: 1,
        data: res,
        msg: 'ok'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage
      }
    }
  }

  async deleteBadComment({ id, type}) {
    const { ctx, app } = this;
    try {
      let sql =  `delete from reply where id = ${id}`
      if (type === 'comment') {
        sql = `delete from comment where comment_id = ${id}`
      }
      const res = await app.mysql.query(sql)
      if (res.affectedRows) {
        ctx.body = {
          code: 1,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          code: 0,
          msg: '删除失败'
        }
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        msg: '删除失败'
      }
    }
  }

  async passComment({ id, type}) {
    const { ctx, app } = this;
    try {
      let sql =  `update  reply set pass = true  where id = ${id}`
      if (type === 'comment') {
        sql = `update comment set pass = true where comment_id = ${id}`
      }
      const res = await app.mysql.query(sql)
      if (res.affectedRows) {
        ctx.body = {
          code: 1,
          msg: '通过审核'
        }
      } else {
        ctx.body = {
          code: 0,
          msg: '审核失败'
        }
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 0,
        msg: '审核失败'
      }
    }
  }
}

module.exports = ReviewService;
