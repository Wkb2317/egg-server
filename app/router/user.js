module.exports = app => {
  const { router, controller, middleware } = app;
  router.post('/api/updateUserInfo',controller.user.updateUser)

  router.post('/api/register',controller.user.register)

  router.post('/api/updatePassword',controller.user.updatePassword)

  router.get('/api/getLoginIntegration',controller.user.getLoginIntegration)

  router.get('/api/getInegrationHistory',controller.user.getIntegrationHistory)
}
