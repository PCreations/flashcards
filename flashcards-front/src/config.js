const convict = require("convict");

const schema = {
  CYPRESS_BASE_URL: {
    doc: "The cypress base url",
    format: String,
    default: null,
    env: "REACT_APP_CYPRESS_baseUrl"
  },
  API_URL: {
    doc: "The api of the url",
    format: String,
    default: null,
    env: "REACT_APP_API_URL"
  }
};

module.exports = {
  getConfig: () => {
    const config = convict(schema);

    config.validate({ allowed: "strict" });

    return config.getProperties();
  }
};
