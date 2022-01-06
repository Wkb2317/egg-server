'use strict';

function checktoken() {
  return async function(ctx, next) {
    const token = ctx.request.header.token;
    const secret = ctx.app.config.jwt.secret;
    console.log(token);
    try {
      const decode = ctx.app.jwt.verify(token, secret);
      console.log(decode);
      if (decode.username) {
        console.log(decode.username);
        await next();
      } else {
        ctx.body = '验证失败';
      }
    } catch (err) {
      console.log(err);
      ctx.body = '验证失败';
    }
  };
}

module.exports = checktoken;
