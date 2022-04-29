module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.get("/api/getUploadQuestion", controller.uploadQuestion.getUploadQuestion);

  router.post("/api/uploadQuestion", controller.uploadQuestion.uploadQuestion);
  router.post("/api/updateQuestion", controller.uploadQuestion.updateQuestion);
};
