module.exports = app => {
  const { router, controller } = app
  router.get('/api/getQuestions', controller.question.getQuestions)
  router.get('/api/getQuestionDetail', controller.question.getQuestionDetail)
}
