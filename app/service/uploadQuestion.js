"use strict";

const Service = require("egg").Service;
const await = require("await-stream-ready/lib/await");
const dayjs = require("dayjs");

class UploadQuestionService extends Service {
  async uploadQuestion({ title, detail, userId, type ,time}) { 
    try {
      const res = await this.app.mysql.query('insert into upload_question (title,detail,user_id,type,time) values(?,?,?,?,?)', [title, detail, userId, type, time])
      if (res.affectedRows) {
        return this.ctx.body = {
          code: 1,
          msg: '提交成功'
        }
      } else {
        return this.ctx.body = {
          code: 1,
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
      const res = await this.app.mysql.query('select * from upload_question where user_id = ? order by time desc', [userId])
      console.log(res)
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
}

module.exports = UploadQuestionService;
