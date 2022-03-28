'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	require('./router/login')(app)
	require('./router/upload')(app)
	require('./router/user')(app)
	require('./router/io')(app)
}
