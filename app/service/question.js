'use strict'

const Service = require('egg').Service

class QuestionService extends Service {
  async getQuestions(userId, type) {
    const { app } = this
    try {
      const res = await app.mysql.query(
        ` select q.*,c.collect,e.user_id from question q LEFT JOIN 
        (select question_id,COUNT(question_id) AS collect from collect where is_collect = 1 GROUP BY question_id) c on q.id = c.question_id LEFT JOIN collect e on e.question_id = q.id and  e.is_collect = 1 and e.user_id = ? WHERE q.type = ?`,
        [userId, type]
      )
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async getQuestionDetail(userId, questionId) {
    const { app } = this

    try {
      const res = await app.mysql.query(
        'select * from question q left join collect c on q.id = c.question_id and c.user_id = ?  where q.id = ?',
        [userId, questionId]
      )
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async collectQuestion(userId, questionId) {
    try {
      const res = await this.app.mysql.query(
        'select * from collect where user_id = ? and question_id = ? ',
        [userId, questionId]
      )
      console.log(res)
      if (Object.keys(res).length) {
        const updateRes = await this.app.mysql.query(
          'update collect set is_collect = ? where user_id = ? and question_id = ? ',
          [res[0].is_collect ? 0 : 1, userId, questionId]
        )
        return updateRes
      } else {
        const insertRes = await this.app.mysql.query(
          'insert into collect  (user_id,question_id,save,is_collect) values (?,?,?,?) ',
          [userId, questionId, '', 1]
        )
        return insertRes
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

module.exports = QuestionService
