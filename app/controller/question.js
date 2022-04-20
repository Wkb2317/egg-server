'use strict'

const Controller = require('egg').Controller

class QuestionController extends Controller {
  async getQuestions() {
    const { ctx, app } = this
    const { userId, type } = ctx.request.query

    try {
      const data = await ctx.service.question.getQuestions(userId, type)
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
    const { userId, questionId } = ctx.request.query
    try {
      const data = await ctx.service.question.getQuestionDetail(userId, questionId)
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

  async collectQuestion() {
    const { ctx } = this
    const { userId, questionId } = ctx.request.query
    try {
      const data = await ctx.service.question.collectQuestion(userId, questionId)
      return (ctx.body = {
        code: 1,
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
