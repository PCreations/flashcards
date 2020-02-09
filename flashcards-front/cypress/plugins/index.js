const { getConfig } = require("../../src/config");

module.exports = (on, config) => {
  const appConfig = getConfig();

  config.baseUrl = appConfig.CYPRESS_BASE_URL;
  config.env = {
    ...(config.env || {}),
    API_ROOT_URL: appConfig.API_ROOT_URL
  };
  return config;
};
