const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Function to verify access_tokens that are set in the header.
function auth(req, res, next) {
	
	const token = req.headers['x-auth-token'];
	
	// Token is missing
	if( !token ) return res.status(401).json({status: 'failed', error: "Authorization denied. Token is missing. "})
		
	try {

		// Verify token received from header
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		req.user = decoded;
		return next();
		
  } catch (err) {
    return res.status("400").json({
      status: "failed",
      error: "x-auth-token is not valid.",
    });
  }
}


module.exports = auth;