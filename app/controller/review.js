"use strict";

const Controller = require("egg").Controller;

class ReviewController extends Controller {
  async getNoReviewQuestions() {
    try {
      await this.ctx.service.review.getNoReviewQuestions();
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      });
    }
  }

  async reviewQuestion() {
    try {
      await this.ctx.service.review.reviewQuestion(this.ctx.request.body);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,

        msg: error.sqlMessage,
      });
    }
  }
}

module.exports = ReviewController;
