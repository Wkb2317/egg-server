'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  router.post('/login', controller.login.login);
  router.get('/getall', middleware.checkToken(), controller.login.getall);
};

