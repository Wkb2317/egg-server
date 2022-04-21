"use strict";

const Controller = require("egg").Controller;

class QuestionController extends Controller {
  async getQuestions() {
    const { ctx, app } = this;
    const { userId, type } = ctx.request.query;

    try {
      const data = await ctx.service.question.getQuestions(userId, type);
      return (ctx.body = {
        code: 1,
        data,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      return (ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async getQuestionDetail() {
    const { ctx } = this;
    const { userId, questionId } = ctx.request.query;
    try {
      const data = await ctx.service.question.getQuestionDetail(userId, questionId);
      return (ctx.body = {
        code: 1,
        data,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      return (ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async collectQuestion() {
    const { ctx } = this;
    const { userId, questionId } = ctx.request.query;
    try {
      const data = await ctx.service.question.collectQuestion(userId, questionId);
      return (ctx.body = {
        code: 1,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      return (ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async saveCode() {
    const { ctx } = this;
    const { userId, questionId, value, isCollect } = ctx.request.body;

    try {
      const res = await ctx.service.question.saveCode(userId, questionId, value, isCollect);
      return (ctx.body = res);
    } catch (error) {
      console.log(error);
      return (ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async submitCode() {
    const { ctx } = this;
    try {
      const res = await ctx.service.question.submitCode(ctx.request.body);
      if (res.affectedRows === 1) {
        return (ctx.body = {
          code: 1,
          msg: "提交成功!",
        });
      } else {
        return (ctx.body = {
          code: 0,
          msg: "提交失败!",
        });
      }
    } catch (error) {
      console.log(error);
      return (ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async getSubmit() {
    try {
      await this.ctx.service.question.getSubmit(this.ctx.request.query);
    } catch (error) {
      this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      };
    }
  }

  async setMark() {
    try {
      await this.ctx.service.question.setMark(this.ctx.request.body);
    } catch (error) {
      this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      };
    }
  }
}

module.exports = QuestionController;
