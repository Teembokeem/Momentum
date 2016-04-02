var _ = require('lodash');

var localEnvVars = {
  TITLE:          'App',
  SAFE_TITLE:     'new-app',
  TOKEN_SECRET:   'verysecret'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
