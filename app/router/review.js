module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.get("/api/review/getNoReviewQuestions", controller.review.getNoReviewQuestions);

  router.post("/api/review/reviewQuestion", controller.review.reviewQuestion);
};
