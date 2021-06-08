const express = require('express');

const router = express.Router();
const { createMessage, fetchMessagesByConversationId } = require('./model');
const { createConversation, fetchConversationByUserId } = require('../Conversation/model');
const auth = require('../middleware/auth');

// @route GET api/chat/receiverId
// @desc Fetch all chat for a specified user
// @access private
router.get('/:id', auth, async (req, res) => {

	try {
	
		const [{ _id: id }] = await fetchConversationByUserId(req.user.id, req.params.id);

		fetchMessagesByConversationId(id)
			.then((messages) => res.status(200).json(messages))
			.catch((err) => res.json({ status: "failed", error: err.message }));
	}
	catch(err) {
		return res.status(404).json({ status: "failed", error: "There are conversations found between you and this user."});
	}

});

// @route POST api/chat/receipientId
// @desc Check if there is an existing conversation between sender and receiver. If yes then don't create a new conversation between them
// @desc Post new chat to a specified user
// @access Private
router.post('/:id', auth, async (req, res) => {
	const { message } = req.body;
	let conversation;

	if (!message ) {
		return res
      .status(400)
      .json({ status: "failed", error: "Message field cannot be blank." });
	}

	conversation = await fetchConversationByUserId(req.user.id, req.params.id);

	if (conversation.length === 0) {
		conversation = await createConversation(req.user.id, req.params.id);
	}

	let {_id, members: [sender, receiver]} = conversation[0] || conversation;
		
	if(sender !== req.user.id) {
		sender = req.user.id;
		receiver = req.params.id;
	}

	createMessage(_id, sender, receiver, message)
    .then((message) => res.json(message))
    .catch((err) => res.status(500).json({ status: "failed", error: err.message }));
});

module.exports = router;
