module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.post("/api/updateUserInfo", controller.user.updateUser);

  router.post("/api/register", controller.user.register);

  router.post("/api/updatePassword", controller.user.updatePassword);

  router.get("/api/getLoginIntegration", controller.user.getLoginIntegration);

  router.get("/api/getInegrationHistory", controller.user.getIntegrationHistory);

  router.get("/api/getTotalIntegrationRank", controller.user.getTotalIntegrationRank);

  router.get("/api/getMyRank", controller.user.getMyRank);

  router.get("/api/getWeekRank", controller.user.getWeekRank);

  router.get("/api/getMonthRank", controller.user.getMonthRank);

  router.post("/api/getAllMessage", controller.user.getAllMessage);

  router.post("/api/readMessage", controller.user.readMessage);

  router.post("/api/readAllMessage", controller.user.readAllMessage);
};
