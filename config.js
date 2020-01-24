const convict = require("convict");

const schema = {
  CYPRESS_BASE_URL: {
    doc: "The cypress base url",
    format: String,
    default: null,
    env: "CYPRESS_baseUrl"
  }
};

module.exports = {
  getConfig: () => {
    const config = convict(schema);

    config.validate({ allowed: "strict" });

    return config.getProperties();
  }
};
