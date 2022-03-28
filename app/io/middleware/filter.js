'use strict'

// app/io/middleware/filter.js
// 这个中间件的作用是将接收到的数据再发送给客户端
module.exports = app => {
	return async (ctx, next) => {
		ctx.socket.emit('message', 'packet received!')
		console.log('packet:', this.packet)
		await next()
	}
}
