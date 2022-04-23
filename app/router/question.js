module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/getQuestions", controller.question.getQuestions);
  router.get("/api/getQuestionDetail", controller.question.getQuestionDetail);
  router.get("/api/collectQuestion", controller.question.collectQuestion);
  router.get("/api/getSubmitHistory", controller.question.getSubmit);
  router.get("/api/getComment", controller.question.getComment);

  router.post("/api/saveCode", controller.question.saveCode);
  router.post("/api/submitCode", controller.question.submitCode);
  router.post("/api/setMark", controller.question.setMark);
  router.post("/api/deleteSubmit", controller.question.deleteSubmit);
  router.post("/api/submitComment", controller.question.submitComment);
  router.post("/api/likeComment", controller.question.likeComment);
  router.post("/api/deleteComment", controller.question.deleteComment);
};
