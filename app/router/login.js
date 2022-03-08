'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  router.post('/api/login/account', controller.login.login);
  router.get('/api/login/captcha', controller.login.sendLoginCode);  // 验证码
  router.get('/api/currentUser',middleware.checkToken(),controller.login.getCurrentUser)

  router.post('/api/login/outLogin',controller.login.loginOut)
};

