/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1641469226139_9094';

  // add your middleware config here
  config.middleware = [];

  config.cluster = {
    listen: {
      path: '', port: 8001, hostname: '127.0.0.1',
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
    secret: 'keyl',
  };

  config.cors = {
    origin: '*', allowMethods: 'GET,HEAD,PUT,DELETE,PATCH',
  };

  config.mysql = {
    client: {
      // host
      host: '110.40.236.242', // port
      port: '3306', // username
      user: 'root', // password
      password: 'root', // database
      database: 'program-bank',
    }, // load into app, default is open
    app: true, // load into agent, default is close
    agent: false,
  };

  return {
    ...config, ...userConfig,
  };
};
