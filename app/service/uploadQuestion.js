"use strict";

const Service = require("egg").Service;
const await = require("await-stream-ready/lib/await");
const dayjs = require("dayjs");

class UploadQuestionService extends Service {
  async uploadQuestion({ title, detail, userId, type ,time}) { 
    try {
      const selectRes = await this.app.mysql.query('select id from question where title = ?', [title])
      if (Object.keys(selectRes).length) {
        return this.ctx.body = {
          code: 0,
          msg: '题目名称重复！'
        }
      }
      const res = await this.app.mysql.query('insert into question (title,detail,user_id,type,time,status) values(?,?,?,?,?,?)', [title, detail, userId, type, time,0])
      if (res.affectedRows) {
        return this.ctx.body = {
          code: 1,
          msg: '提交成功'
        }
      } else {
        return this.ctx.body = {
          code: 0,
          msg: '提交失败'
        }
      }
    } catch (error) {
      console.log(error)
      return this.ctx.body = {
        code: 0,
        msg: error.sqlMessage
      }
    }
  }

  async getUploadQuestion({ userId}) { 
    try {
      const res = await this.app.mysql.query('select * from question where user_id = ? order by time desc', [userId])
      return this.ctx.body = {
        code: 1,
        data: res,
        mag:'查询成功'
      }
    } catch (error) {
      console.log(error)
      return this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage
      }
    }
  }

  async updateQuestion({ id,title, detail, type,time }) { 
    console.log(id)
    try {
      const res = await this.app.mysql.query('update question set title=?, detail=?, type=?,time=?,mark=?,status=? where id = ?', [title, detail, type,time,'',0,id])
      console.log(res)
      if (res.affectedRows) {
        return this.ctx.body = {
          code: 1,
          msg: '提交成功'
        }
      } else {
        return this.ctx.body = {
          code: 0,
          msg: '提交失败'
        }
      }
    } catch (error) {
      console.log(error)
      return this.ctx.body = {
        code: 0,
        msg: error.sqlMessage
      }
    }
  }
}

module.exports = UploadQuestionService;
