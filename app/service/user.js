const service = require('egg').Service
const { v4: uuid } = require('uuid')
const dayjs = require('dayjs')
const await = require('await-stream-ready/lib/await')
const { start } = require('egg')

class user extends service {
	async updateUser(user) {
		const { ctx, app } = this
		if (!user.avatar) {
			user.avtar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
		}

		try {
			await app.mysql.update('user', { ...user }, { where: { email: user.email } })
			const userinfo = await app.mysql.get('user', { email: user.email })
			userinfo.isLogin = true
			return (ctx.body = {
				code: 1,
				msg: '修改成功',
				data: userinfo,
			})
		} catch (e) {
			return (ctx.body = {
				code: 0,
				msg: '修改失败',
			})
		}
	}

	async updatePassword(userinfo) {
		const { ctx, app } = this
		try {
			const res = await app.mysql.update('user', { password: userinfo.password }, { where: { email: userinfo.email, code: userinfo.code } })
			// console.log(res)
			if (res.changedRows && res.affectedRows) {
				return (ctx.body = {
					code: 1,
					msg: '密码修改成功！',
				})
			} else if (res.affectedRows && !res.changedRows) {
				return (ctx.body = {
					code: 2,
					msg: '密码不能和上次相同！',
				})
			} else {
				return (ctx.body = {
					code: 3,
					msg: '邮箱或验证码错误！',
				})
			}
		} catch (e) {
			console.log('修改密码异常')
			return (ctx.body = {
				code: 0,
				msg: '服务器异常',
			})
		}
	}

	async register(userinfo) {
		const { ctx, app } = this
		try {
			const options = {
				id: uuid(),
				email: userinfo.email,
				name: '程序员',
				registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				integration: 0,
				password: userinfo.password,
				avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
			}
			const res = await app.mysql.insert('user', options)

			if (res.changedRows === 0 && res.affectedRows === 1) {
				return (ctx.body = {
					code: 1,
					msg: '注册成功！',
				})
			} else if (res.changedRows === 0 && res.affectedRows === 0) {
				return (ctx.body = {
					code: 2,
					msg: '注册失败',
				})
			}
		} catch (e) {
			return (ctx.body = {
				code: 0,
				msg: '账号已存在',
			})
		}
	}

	async getLoginIntegration(uuid) {
		// console.log(uuid)
		const { ctx, app } = this
		try {
			const res = await app.mysql.query(`select * from integration where id = '${uuid}' and time like '${dayjs().format('YYYY-MM-DD')}%'`, [])
			// console.log(res)
			if (Object.keys(res).length) {
				return (ctx.body = {
					code: 0,
					msg: '今天已经登录过了哦',
				})
			} else {
				await app.mysql.insert('integration', {
					id: uuid,
					value: 1,
					type: 'login',
					time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				})
				const userinfo = await app.mysql.get('user', { id: uuid })
				await app.mysql.update('user', { integration: userinfo.integration + 1 }, { where: { id: uuid } })
				return (ctx.body = {
					code: 1,
					msg: '积分喜加一！',
				})
			}
		} catch (e) {
			console.log(e)
			return (ctx.body = {
				code: 0,
				msg: '服务器出问题咯',
			})
		}
	}

	async getIntegrationHistory(uuid) {
		const { ctx, app } = this
		try {
			let res = await app.mysql.select('integration', { where: { id: uuid } })
			return (ctx.body = {
				code: 1,
				msg: 'ok',
				data: res,
			})
		} catch (e) {
			return (ctx.body = {
				code: 0,
				msg: 'sql error',
			})
		}
	}

	// 积分总榜
	async getTotalIntegrationRank() {
		const { ctx, app } = this
		try {
			const sql = 'select id,name,integration,avatar,class from user order by integration desc limit 10'
			let res = await app.mysql.query(sql)

			return (ctx.body = {
				code: 1,
				msg: 'ok',
				data: res,
			})
		} catch (e) {
			return (ctx.body = {
				code: 0,
				msg: 'sql error',
			})
		}
	}

	//  个人排行
	async getMyRank(uuid) {
		const { ctx, app } = this
		try {
			const sql = 'select id from user order by integration desc'
			const res = await app.mysql.query(sql)
			console.log(res)
			const index = res.findIndex(item => uuid === item.id)

			if (index === -1) {
				return (ctx.body = {
					code: 0,
					msg: '没有此用户哦',
				})
			}
			return (ctx.body = {
				code: 1,
				msg: '查询成功',
				rank: index + 1,
			})
		} catch (e) {
			console.log(e)
			return (ctx.body = {
				code: 0,
				msg: '服务器报错咯',
			})
		}
  }
  
  //  周榜
  async getWeekRank(startTime, endTime) {
   
    const { ctx, app } = this
    try {
      const sql = `select n.id,n.name,n.class,n.avatar,sum(n.value) as value  from (select u.id,u.name,u.class, u.avatar,i.value,i.time  from user u LEFT JOIN integration  i on u.id = i.id and i.time BETWEEN '${startTime}' and '${endTime}') n GROUP BY n.id having value > 0 ORDER BY value desc LIMIT 10`
      let res = await app.mysql.query(sql)
      if (Object.keys(res).length) {
        return ctx.body = {
          code: 1,
          msg: '查询成功',
          data:res
        }
      } else {
        return ctx.body = {
          code: 0,
          msg: '该周没有数据哦！',
          
        }
      }
    } catch (e) {
      console.log(e)
      return ctx.body = {
        code: 0,
        msg: 'sql error'
      }
    }
  }

  // 月榜
  async getMonthRank(month) {
 const { ctx, app } = this
    try {
      const sql = `select n.id,n.name,n.class,n.avatar,sum(n.value) as value  from (select u.id,u.name,u.class, u.avatar,i.value,i.time  from user u LEFT JOIN integration  i on u.id = i.id and i.time like '${month}%' ) n GROUP BY n.id having value > 0 ORDER BY value desc LIMIT 10`
      let res = await app.mysql.query(sql)
      if (Object.keys(res).length) {
        return ctx.body = {
          code: 1,
          msg: '查询成功',
          data:res
        }
      } else {
        return ctx.body = {
          code: 0,
          msg: '该月没有数据哦！',
          
        }
      }
    } catch (e) {
      console.log(e)
      return ctx.body = {
        code: 0,
        msg: 'sql error'
      }
    }
  }

  // 拿消息
  async getAllMessage(from_id, to_id) {
    const { ctx, app } = this
    try {
      const res = await app.mysql.query(`select * from messages where   to_id = '${from_id}' or from_id = '${from_id}' order by time`)
      // console.log(res);
      return ctx.body = {
        code: 1,
        data: res
      }
    } catch (error) {
      console.log(error)
      return ctx.body = {
        code: 0,
        msg: error
      }
      
    }
  }
}

module.exports = user
