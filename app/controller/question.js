'use strict'

const Controller = require('egg').Controller

class QuestionController extends Controller {
  async getQuestions() {
    const { ctx, app } = this
    const { type } = ctx.request.query

    try {
      const data = await ctx.service.question.getQuestions(type)
      return (ctx.body = {
        code: 1,
        data,
        msg: 'ok',
      })
    } catch (error) {
      console.log(error)
      return (ctx.body = {
        code: 0,
        msg: error,
      })
    }
  }

  async getQuestionDetail() {
    const { ctx } = this
    const { id } = ctx.request.query
    try {
      const data = await ctx.service.question.getQuestionDetail(id)
      return (ctx.body = {
        code: 1,
        data,
        msg: 'ok',
      })
    } catch (error) {
      console.log(error)
      return (ctx.body = {
        code: 0,
        msg: error,
      })
    }
  }
}

module.exports = QuestionController
