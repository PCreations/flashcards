const convict = require("convict");

const schema = {
  CYPRESS_BASE_URL: {
    doc: "The cypress base url",
    format: String,
    default: null,
    env: "REACT_APP_CYPRESS_baseUrl"
  },
  API_ROOT_URL: {
    doc: "The root url of the api",
    format: String,
    default: null,
    env: "REACT_APP_API_ROOT_URL"
  }
};

module.exports = {
  getConfig: () => {
    const config = convict(schema);

    config.validate({ allowed: "strict" });

    return config.getProperties();
  }
};
