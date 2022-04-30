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

  async getAllUser() {
    try {
      await this.ctx.service.review.getAllUser(this.ctx.request.query);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      });
    }
  }

  async changeUserAccess() {
    try {
      await this.ctx.service.review.changeUserAccess(this.ctx.request.body);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: "修改失败",
      });
    }
  }

  async getAllCommentAndReply() {
    try {
      await this.ctx.service.review.getAllCommentAndReply(this.ctx.request.query);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      });
    }
  }

  async deleteBadComment() {
    try {
      await this.ctx.service.review.deleteBadComment(this.ctx.request.body);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: "删除失败",
      });
    }
  }

  async passComment() {
    try {
      await this.ctx.service.review.passComment(this.ctx.request.body);
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: "审核失败",
      });
    }
  }
}

module.exports = ReviewController;
