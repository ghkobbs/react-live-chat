const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();
const { fetchUserByEmail, fetchUserById, addOnlineUser, deleteOnlineUser, createUser } = require("../users/model");
const oAuth = require('../middleware/auth0');
const auth = require('../middleware/auth');

// @route Get api/auth/oAuth
// @desc Authenticate users of auth0
// @access Private
router.get('/oAuth', oAuth, async (req, res) => {

	const { email, name, nickname } = req.user;

  function generateToken(user) {

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Sign json web token with our secret
    jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: 3600,
    }, (err, token) => {
      if (err) return reject(err);

      // Add logged in user to online list
      addOnlineUser(user.id);

      // Return our user object along side the token
      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          blockList: user.blockList,
        },
      });
    });
  }

  if (!email || !name) {
    return res
      .status(400)
      .json({ status: "failed", error: "Please enter all fields." });
  }

  try {
    const existingUser = await fetchUserByEmail(email);

    if(existingUser) {
      return await generateToken(existingUser)
    }
    
    createUser(req.user)
      .then(async (user) => {
        if (!user)
          return res
            .status(400)
            .json({ status: "failed", error: "User does not exist." });
        
        return await generateToken(user);
    });
  } catch (err) {
    return res.status(400).json({ status: "failed", error: err.message });
  }
});

// @route GET api/auth/user
// @desc Fetch user data
// @access Private
router.get("/user", auth, (req, res) => {
  fetchUserById(req.user.id)
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ status: "failed", error: "User does not exist." });

			// Return our user object along side the token
			return res.status(200).json(user);
		})
		.catch((err) =>
			res.status(400).json({ status: "failed", error: err.message })
		);
});

// @route GET api/auth/logout
// @desc End user session
// @access Private
router.get("/logout", auth, (req, res) => {
  deleteOnlineUser(req.user.id)
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ status: "failed", error: "User does not exist." });
      return res.status(200).json(user);
    })
    .catch((err) =>
      res.status(400).json({ status: "failed", error: err.message })
    );
});

module.exports = router;
