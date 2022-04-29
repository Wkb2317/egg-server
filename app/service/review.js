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
}

module.exports = ReviewService;
