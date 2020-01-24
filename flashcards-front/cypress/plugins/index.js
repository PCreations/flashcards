const { getConfig } = require("../../src/config");

module.exports = (on, config) => {
  const appConfig = getConfig();
  config.baseUrl = appConfig.CYPRESS_BASE_URL;
  return config;
};
