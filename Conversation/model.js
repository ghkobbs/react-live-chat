const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const { ObjectId } = mongoose.Schema.Types;
const ObjectIdValue = mongoose.Types.ObjectId;

const conversationsSchema = Schema({
  members: { type: Array, required: true },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationsSchema);

// Create a new conversation
const createConversation = (sender, receiver) =>
	new Promise((resolve, reject) => {
		try {
			let conversation = new Conversation({
				members: [sender, receiver]
			});
			
			conversation.save()
				.then((conversation) => {
					// Return our conversation 
					return resolve(conversation);
				});
		} catch (e) {
			return reject(e);
		}
	});

// Fetch conversation
const fetchConversationByUserId = (id1, id2) =>
	new Promise((resolve, reject) => {
		try {
			
			Conversation.find({
				members: { $all: [ id1, id2 ] }
			})
				.exec((err, message) => {
					if(err) return reject(err);
					return resolve(message);
				})
				
		} catch (e) {
			return reject(e);
		}
	});

module.exports = {
  Conversation,
  createConversation,
  fetchConversationByUserId,
};
