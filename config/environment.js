var _ = require('lodash');

var localEnvVars = {
  TITLE:          'Momentum',
  SAFE_TITLE:     'momentum',
  COOKIE_SECRET:  'notsosecretnowareyou',
  SESSION_SECRET: 'anotherfoolishsecret',
  TOKEN_SECRET:   'momentum'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
