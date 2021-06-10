const express = require('express');

const router = express.Router();
const { OnlineUsers, addToBlockList, removeFromBlockList } = require("./model");
const auth = require('../middleware/auth');

// @route GET api/users
// @desc Fetch all online users
// @access private
router.get('/', auth, (req, res) => {
	OnlineUsers.find()
		.populate('userId', '-password')
    .then((users) => res.json(users))
    .catch((err) => res.json({ status: "failed", error: err.message }));
});

// @route POST api/users/block
// @desc Block a user
// @access Private
router.post('/block', auth, (req, res) => {
	const { id } = req.body;

	if (!id ) {
		return res
      .status(400)
      .json({ status: "failed", error: "User id was not provided." });
	}

	addToBlockList(req.user.id, id)
		.then((user) => res.json(user))
		.catch((err) => res.json({ status: 'failed', error: err.message }));
});

router.post('/unblock', auth, (req, res) => {
	const { id } = req.body;

	if (!id ) {
		return res
      .status(400)
      .json({ status: "failed", error: "User id was not provided." });
	}

	removeFromBlockList(req.user.id, id)
		.then((user) => res.json(user))
		.catch((err) => res.json({ status: 'failed', error: err.message }));
});

module.exports = router;
