var environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

const env = environments[process.env.NODE_ENV]
  ? environments[process.env.NODE_ENV]
  : environments.staging;

module.exports = env;
