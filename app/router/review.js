module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.get("/api/review/getNoReviewQuestions", controller.review.getNoReviewQuestions);
  router.get("/api/admin/getAllUser", controller.review.getAllUser);
  router.get("/api/admin/getAllCommentAndReply", controller.review.getAllCommentAndReply);

  router.post("/api/review/reviewQuestion", controller.review.reviewQuestion);
  router.post("/api/review/changeUserAccess", controller.review.changeUserAccess);
  router.post("/api/review/deleteBadComment", controller.review.deleteBadComment);
  router.post("/api/review/passComment", controller.review.passComment);
};
