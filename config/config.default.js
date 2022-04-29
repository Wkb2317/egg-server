/* eslint valid-jsdoc: "off" */
const path = require("path");
("use strict");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1641469226139_9094";

  // add your middleware config here
  config.middleware = [];

  config.cluster = {
    listen: {
      path: "",
      port: 8001,
      // hostname: "127.0.0.1",
      hostname: "172.17.0.11",
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: false,
  };

  config.jwt = {
    secret: "keyl",
  };

  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,DELETE,PATCH",
  };

  config.mysql = {
    client: {
      // host: "127.0.0.1",
      host: "110.40.236.242",
      port: "3306",
      user: "root",
      password: "root",
      database: "program-bank",
    }, // load into app, default is open
    app: true, // load into agent, default is close
    agent: false,
  };

  // config.assets = {
  //   publicPath: '/static/',
  // };

  config.static = {
    // 静态化访问前缀,如：`http://127.0.0.1:7001/static/images/logo.png`
    prefix: "/static",
    dir: path.resolve(__dirname, "../static"), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
    dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
    preload: false,
    maxAge: 31536000, // in prod env, 0 in other envs
    buffer: true, // in prod env, false in other envs
  };

  config.multipart = {
    mode: "stream",
    tmpdir: path.resolve(__dirname, "../static"),
    whitelist() {
      return true;
    },
    cleanSchedule: {
      cron: "0 30 4 * * *", // 自动清除时间
    },
  };

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      "/": {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
