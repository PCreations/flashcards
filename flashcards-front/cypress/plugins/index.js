const axios = require("axios");
const { getConfig } = require("../../src/config");

module.exports = (on, config) => {
  const appConfig = getConfig();

  config.baseUrl = appConfig.CYPRESS_BASE_URL;
  config.env = {
    ...(config.env || {}),
    API_ROOT_URL: appConfig.API_ROOT_URL
  };

  on("task", {
    seedTestBox({ partitions }) {
      console.log("PARTITIONS", partitions);
      return axios
        .post(`${appConfig.API_TEST_URL}/__seedDb`, {
          partitions
        })
        .then(res => res.data);
    }
  });

  return config;
};
