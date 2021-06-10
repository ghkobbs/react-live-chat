const mongoose = require('mongoose');

const { Schema } = mongoose;
const dotenv = require('dotenv');

dotenv.config();
const { ObjectId } = mongoose.Schema.Types;
const ObjectIdValue = mongoose.Types.ObjectId;

const messageSchema = Schema({
  conversationId: { type: ObjectId, ref: "Conversation", required: true },
  sender: { type: ObjectId, ref: "User", required: true },
  receiver: { type: ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  created: { type: Date, required: true },
});

const Message = mongoose.model('Message', messageSchema);

// Create a new message
const createMessage = (conversationId, sender, receiver, chat) =>
  new Promise((resolve, reject) => {
    try {
      let message = new Message({
        conversationId,
        sender,
        receiver,
        message: chat,
        created: new Date(),
      });

      message
        .save()
        .then((message) => {
          // Return our user object along side the token
          return resolve(message);
        })
        .catch((err) => reject(err));
    } catch (e) {
      return reject(e);
    }
  });

// Fetch a user
const fetchMessagesByConversationId = (conversationId) =>
  new Promise((resolve, reject) => {
    try {
      Message.find({ conversationId })
        .populate("receiver", "-password -blockList -created")
        .exec((err, message) => {
          if (err) return reject(err);
          return resolve(message);
        });
    } catch (e) {
      return reject(e);
    }
  });

module.exports = {
  Message,
  createMessage,
  fetchMessagesByConversationId,
};
