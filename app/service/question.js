"use strict";

const Service = require("egg").Service;
const dayjs = require("dayjs");

class QuestionService extends Service {
  async getQuestions(userId, type) {
    const { app } = this;
    try {
      return await app.mysql.query(
        ` select q.*,c.collect,e.user_id from question q LEFT JOIN 
        (select question_id,COUNT(question_id) AS collect from collect where is_collect = 1 GROUP BY
         question_id) c on q.id = c.question_id LEFT JOIN collect e on e.question_id = q.id and e.is_collect = 1 and e.user_id = ?  WHERE q.type = ?  and q.status = 1`,
        [userId, type],
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getQuestionDetail(userId, questionId) {
    const { app } = this;
    try {
      return await app.mysql.query(
        "select * from question q left join collect c on q.id = c.question_id and c.user_id = ?  where q.id = ?",
        [userId, questionId],
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async collectQuestion(userId, questionId) {
    try {
      const res = await this.app.mysql.query(
        "select * from collect where user_id = ? and question_id = ? ",
        [userId, questionId],
      );
      if (Object.keys(res).length) {
        return await this.app.mysql.query(
          "update collect set is_collect = ? where user_id = ? and question_id = ? ",
          [res[0].is_collect ? 0 : 1, userId, questionId],
        );
      } else {
        return await this.app.mysql.query(
          "insert into collect  (user_id,question_id,save,is_collect) values (?,?,?,?) ",
          [userId, questionId, "", 1],
        );
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async saveCode(userId, questionId, value, isCollect) {
    try {
      const selectRes = await this.app.mysql.query(
        "select id from collect where user_id = ? and question_id = ?",
        [userId, questionId],
      );
      let sql = "";
      if (Object.keys(selectRes).length) {
        sql = `update collect set save = "${value}" where id = ${selectRes[0].id}`;
      } else {
        sql = `insert into collect (user_id, question_id, save, is_collect) values ('${userId}','${questionId}','${value}',${isCollect})`;
      }
      const res = await this.app.mysql.query(sql);
      if (res.affectedRows === 1) {
        return {
          code: 1,
          msg: "保存成功！",
        };
      } else {
        return {
          code: 0,
          msg: "保存失败！",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        code: 0,
        msg: error.sqlMessage,
      };
    }
  }

  async submitCode({ userId, questionId, value }) {
    try {
      const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      return await this.app.mysql.query(
        "insert into submit (user_id, question_id,data, time) values (?,?,?,?)",
        [userId, questionId, value, time],
      );
    } catch (error) {
      console.log(error);
      return {
        code: 0,
        msg: error.sqlMessage,
      };
    }
  }

  async getSubmit({ userId, questionId }) {
    try {
      const res = await this.app.mysql.query(
        "select * from submit s left join user u on u.id = s.user_id where user_id = ? and question_id = ? order by s.time desc",
        [userId, questionId],
      );
      return (this.ctx.body = {
        code: 1,
        data: res,
      });
    } catch (error) {
      return (this.ctx.body = {
        code: 0,
        data: error.sqlMessage,
      });
    }
  }

  async setMark({ markId, mark }) {
    try {
      const res = await this.app.mysql.query("update submit set mark = ? where mark_id = ?  ", [
        mark,
        markId,
      ]);
      if (res.affectedRows) {
        return (this.ctx.body = {
          code: 1,
          msg: "保存成功！",
        });
      }
      return (this.ctx.body = {
        code: 0,
        msg: "保存失败！",
      });
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async deleteSubmit({ markId, userId }) {
    try {
      const res = await this.app.mysql.query(
        "delete from submit where mark_id = ? and user_id = ?",
        [markId, userId],
      );
      if (res.affectedRows) {
        return (this.ctx.body = {
          code: 1,
          msg: "删除成功！",
        });
      }
      return (this.ctx.body = {
        code: 0,
        msg: "删除失败！",
      });
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async submitComment({ userId, questionId, content }) {
    try {
      const res = await this.app.mysql.query(
        "insert into comment (user_id, question_id, content,comment_time,zan_count) values" +
          " (?,?,?,?,?)",
        [userId, questionId, content, dayjs().format("YYYY-MM-DD HH:mm:ss"), 0],
      );
      if (res.affectedRows) {
        return (this.ctx.body = {
          code: 1,
          msg: "评论成功！",
        });
      }
      return (this.ctx.body = {
        code: 0,
        msg: "评论失败！",
      });
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async getComment({ userId, questionId }) {
    try {
      const res = await this.app.mysql.query(
        "select c.*,u.name,u.avatar,z.user_id as isLike,r.reply_count from comment c join" +
          " user u" +
          " on c.user_id" +
          " = u.id LEFT JOIN zan z on c.comment_id = z.comment_id and z.user_id = ? left join " +
          "(select r.reply_id,COUNT(reply_id) as reply_count " +
          "from reply r GROUP BY r.reply_id) r on c.comment_id = r.reply_id" +
          " where  " +
          "question_id = ? order by c.comment_time  desc",
        [userId, questionId],
      );
      return (this.ctx.body = {
        code: 1,
        msg: "ok",
        data: res,
      });
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      });
    }
  }

  async likeComment({ userId, commentId }) {
    try {
      const selectRes = await this.app.mysql.query(
        "select * from zan where user_id = ? and comment_id = ?",
        [userId, commentId],
      );
      let updateCountSql = `update comment set zan_count = zan_count + 1  where comment_id = ${commentId}`;
      let sql = `insert into zan (user_id,comment_id) values ('${userId}',${commentId})`;
      if (Object.keys(selectRes).length) {
        sql = `delete from zan where id = ${selectRes[0].id}`;
        updateCountSql = `update comment set zan_count =  zan_count - 1  where comment_id = ${commentId}`;
      }
      const res = await this.app.mysql.query(sql);
      const updateRes = await this.app.mysql.query(updateCountSql);

      if (res.affectedRows && updateRes.affectedRows) {
        return (this.ctx.body = {
          code: 1,
          msg: "ok",
        });
      } else {
        return (this.ctx.body = {
          code: 0,
          msg: "操作失败",
        });
      }
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async deleteComment({ commentId }) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query(
        "delete c.*,z.*,r.* from comment as c left join zan as z on c.comment_id = z.comment_id" +
          " left join reply r on c.comment_id = r.reply_id   where" +
          " c.comment_id" +
          " = ?",
        [commentId],
      );
      if (res.affectedRows) {
        return (ctx.body = {
          code: 1,
          msg: "删除成功",
        });
      } else {
        return (ctx.body = {
          code: 0,
          msg: "删除失败",
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

  async submitReply({ commentId, userId, content }) {
    try {
      const res = await this.app.mysql.query(
        "insert into reply (from_userid, reply_id, reply_content,reply_time) values" + " (?,?,?,?)",
        [userId, commentId, content, dayjs().format("YYYY-MM-DD HH:mm:ss")],
      );
      if (res.affectedRows) {
        return (this.ctx.body = {
          code: 1,
          msg: "评论成功！",
        });
      }
      return (this.ctx.body = {
        code: 0,
        msg: "评论失败！",
      });
    } catch (error) {
      console.log(error);
      return (this.ctx.body = {
        code: 0,
        msg: error.sqlMessage,
      });
    }
  }

  async getReply({ commentId }) {
    try {
      const res = await this.app.mysql.query(
        "select r.id as reply_index, r.reply_content,r.from_userid,r.reply_time,u.name,u.avatar" +
          " from reply" +
          " r left" +
          " join" +
          " user u" +
          " on " +
          "  u.id = r.from_userid where r.reply_id  = ?  order by r.reply_time desc",
        [commentId],
      );
      return (this.ctx.body = {
        code: 1,
        data: res,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      };
    }
  }

  async deleteReply({ id }) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query("delete  from reply  where id = ? ", [id]);
      if (res.affectedRows) {
        return (ctx.body = {
          code: 1,
          msg: "删除成功",
        });
      } else {
        return (ctx.body = {
          code: 0,
          msg: "删除失败",
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

  async submitDiscuss({ userId, data }) {
    const { ctx, app } = this;
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    try {
      const res = await app.mysql.query("insert into discuss (user_id,data,time)  values(?,?,?)", [
        userId,
        data,
        time,
      ]);
      if (res.affectedRows) {
        return (ctx.body = {
          code: 1,
          msg: "发布成功",
        });
      } else {
        return (ctx.body = {
          code: 0,
          msg: "发布失败",
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

  async getDiscuss() {
    try {
      const res = await this.app.mysql.query(
        "select d.user_id,d.user_id,d.time,d.data,u.avatar,u.name from discuss d left join" +
          " user u on" +
          " d.user_id = u.id order by d.time ",
      );
      return (this.ctx.body = {
        code: 1,
        data: res,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      };
    }
  }

  async getLikeQuestion({ data }) {
    try {
      const res = await this.app.mysql.query(`select * from question where title like '%${data}%'`);
      return (this.ctx.body = {
        code: 1,
        data: res,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      };
    }
  }

  async getCollectQuestion({ userId }) {
    try {
      const res = await this.app.mysql.query(
        `select * from collect c left join question q on c.is_collect = ? and c.question_id = q.id  where c.user_id = ? and c.is_collect = ? order by q.time desc`,
        [1, userId, 1],
      );
      return (this.ctx.body = {
        code: 1,
        data: res,
        msg: "ok",
      });
    } catch (error) {
      console.log(error);
      this.ctx.body = {
        code: 0,
        data: [],
        msg: error.sqlMessage,
      };
    }
  }
}

module.exports = QuestionService;
