module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/getQuestions", controller.question.getQuestions);
  router.get("/api/getQuestionDetail", controller.question.getQuestionDetail);
  router.get("/api/collectQuestion", controller.question.collectQuestion);
  router.get("/api/getSubmitHistory", controller.question.getSubmit);

  router.post("/api/saveCode", controller.question.saveCode);
  router.post("/api/submitCode", controller.question.submitCode);
  router.post("/api/setMark", controller.question.setMark);
};
