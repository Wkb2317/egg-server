"use strict";

const await = require("await-stream-ready/lib/await");

const Controller = require("egg").Controller;

class UploadQuestionController extends Controller {
  async uploadQuestion() {
    try {
      await this.ctx.service.uploadQuestion.uploadQuestion(this.ctx.request.body)
    } catch (error) {
      console.log(error)
      return this.ctx.body = {
        code: 0,
        msg: error.sqlMessage
      }
    }
  }

  async getUploadQuestion() {
    try {
      await this.ctx.service.uploadQuestion.getUploadQuestion(this.ctx.request.query)
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

module.exports = UploadQuestionController;
