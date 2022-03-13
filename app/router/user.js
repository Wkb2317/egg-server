module.exports = app => {
  const { router, controller, middleware } = app;
  router.post('/api/updateUserInfo',controller.user.updateUser)
}
