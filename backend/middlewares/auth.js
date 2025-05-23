const { auth } = require('express-oauth2-jwt-bearer');
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = process.env;

// Middleware to validate JWT tokens
const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

module.exports = checkJwt;