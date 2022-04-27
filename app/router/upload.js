module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.post("/api/upload", controller.upload.uploadImage);
};
