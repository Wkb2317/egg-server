module.exports = (app) => {
  const { router, controller, io } = app;

  // socket.io
  io.of("/").route("chat", io.controller.connect.connect);

  io.of("/").route("sendMessage", io.controller.connect.getMessage);
};
