const axios = require('axios');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
var jwksClient = require("jwks-rsa");

dotenv.config();

const tokenEndpoint = `https://${process.env.AUTHO_DOMAIN}/oauth/token`;

var client = jwksClient({
  jwksUri: `https://${process.env.AUTHO_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const oAuth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
	
	// Token is missing
	if( !token ) return res.status(401).json({status: 'failed', error: "Authorization denied. Token is missing. "})
  
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("redirect_uri", process.env.REDIRECT_URI);
  params.append("code", token);
  
  axios.post(tokenEndpoint, params)
  .then(response => {
    jwt.verify(response.data.id_token, getKey, {}, function(err, decoded) {
      req.user = decoded;
      next();
    })
  })
  .catch(err => res.status(403).json({status: 'failed', error: err.message}))

}

module.exports = oAuth;
