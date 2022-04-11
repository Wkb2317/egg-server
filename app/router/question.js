module.exports = app => {
  const { router, controller } = app
  router.get('/api/getQuestions', controller.question.getQuestions)
}
