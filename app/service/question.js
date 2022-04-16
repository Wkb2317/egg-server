'use strict'

const Service = require('egg').Service

class QuestionService extends Service {
  async getQuestions(type) {
    const { app } = this
    try {
      const res = await app.mysql.query('select * from question where type = ?', [type])
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async getQuestionDetail(id) {
    const { app } = this
    try {
      const res = await app.mysql.query('select * from question where id = ?', [id])
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

module.exports = QuestionService
