'use strict'

const Service = require('egg').Service

class ServerService extends Service {
	async updateId(userId, socketId) {
		const { ctx, app } = this
	}
}

module.exports = ServerService
