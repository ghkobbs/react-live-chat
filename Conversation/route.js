const express = require("express");

const router = express.Router();
const { Conversation, fetchConversationByUserId, createConversation } = require("./model");
const auth = require("../middleware/auth");

// @route GET api/chat/userId
// @desc Fetch all chat for a specified user
// @access private
router.get("/:id", auth, (req, res) => {

  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: "failed", error: "Missing required parameter" });
  }

  fetchConversationByUserId(req.params.id)
    .then((conversation) => res.status(200).json(conversation))
    .catch((err) => res.json({ status: "failed", error: err.message }));

});

// @route POST api/chat/userId
// @desc Post new chat to a specified user
// @access Public
router.post("/", auth, (req, res) => {

  if (!req.body.receiver) {
    return res
      .status(400)
      .json({ status: "failed", error: "Missing sender or receiver id" });
  }

  createConversation(req.user.id, req.body.receiver)
    .then((conversation) => res.json(conversation))
    .catch((err) => res.json({ status: "failed", error: err.message }));
});

module.exports = router;
