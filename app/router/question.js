module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/getQuestions", controller.question.getQuestions);
  router.get("/api/getQuestionDetail", controller.question.getQuestionDetail);
  router.get("/api/collectQuestion", controller.question.collectQuestion);
  router.get("/api/getSubmitHistory", controller.question.getSubmit);
  router.get("/api/getComment", controller.question.getComment);
  router.get("/api/getReply", controller.question.getReply);
  router.get("/api/getDiscuss", controller.question.getDiscuss);
  router.get("/api/getLikeQuestion", controller.question.getLikeQuestion);
  router.get("/api/getCollectQuestion", controller.question.getCollectQuestion);

  router.post("/api/saveCode", controller.question.saveCode);
  router.post("/api/submitCode", controller.question.submitCode);
  router.post("/api/setMark", controller.question.setMark);
  router.post("/api/deleteSubmit", controller.question.deleteSubmit);
  router.post("/api/submitComment", controller.question.submitComment);
  router.post("/api/likeComment", controller.question.likeComment);
  router.post("/api/deleteComment", controller.question.deleteComment);
  router.post("/api/submitReply", controller.question.submitReply);
  router.post("/api/deleteReply", controller.question.deleteReply);
  router.post("/api/submitDiscuss", controller.question.submitDiscuss);
};
