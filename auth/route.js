const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();
const { fetchUserByEmail, fetchUserById, addOnlineUser, deleteOnlineUser } = require("../users/model");
const auth = require('../middleware/auth');

// @route POST api/auth
// @desc Authenticate users
// @access Public
router.post('/', (req, res) => {
	const { email, password } = req.body;

	if( !email || !password ) {
		return res.status(400).json({ status: "failed", error: "Please enter all fields."});
	}

  try {
    fetchUserByEmail(email)
      .then((user) => {
        if (!user)
          return res
            .status(400)
            .json({ status: "failed", error: "User does not exist." });

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (!isMatch)
            return res
              .status("400")
              .json({ status: "failed", error: "Invalid Credentials" });

          const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            blockList: user.blockList
          };

          // Sign json web token with our secret
          jwt.sign(
            data,
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err)
                return res.status("400").json({
                  status: "failed",
                  error:
                    "An error occurred while processing your last request.",
                });

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
            }
          );
        });
      })
  }
  catch(err) {
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
