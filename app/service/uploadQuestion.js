"use strict";

const Service = require("egg").Service;
const await = require("await-stream-ready/lib/await");
const dayjs = require("dayjs");

class UploadQuestionService extends Service {
  async uploadQuestion({ title, detail, userId, type ,time}) { 
    try {
      const res = await this.app.mysql.query('insert into upload_question (title,detail,user_id,type,time,status) values(?,?,?,?,?,?)', [title, detail, userId, type, time,0])
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

  async deleteUploadQuestion({ id }) { 
    console.log(id)
    try {
      const res = await this.app.mysql.query('delete from upload_question where id = ?', [id])
      console.log(res)
      if (res.affectedRows) {
        return this.ctx.body = {
          code: 1,
          msg: '删除成功'
        }
      } else {
        return this.ctx.body = {
          code: 1,
          msg: '删除失败'
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
