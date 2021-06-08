const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { ObjectId } = mongoose.Schema.Types;
const ObjectIdValue = mongoose.Types.ObjectId;

const userSchema = Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	blockList: { type: Array, required: false, default: [] },
	created: { type: Date, required: true },
});

const onlineSchema = Schema({
  userId: { type: ObjectId, ref: 'User', required: true }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
const OnlineUsers = mongoose.model('OnlineUser', onlineSchema);

// Create a new user
const createUser = (params) =>
	new Promise((resolve, reject) => {
		try {
			let user = new User({
				name: params.name,
				email: params.email,
				password: params.password,
				created: new Date(),
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, async (err, hash) => {
					if (err) return reject(err);

					user.password = hash;
					user.save()
						.then((user) => {

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
                return resolve({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                });
              });
						})
				});
			});
		} catch (e) {
			return reject(e);
		}
	});

// Fetch a user
const fetchUserByEmail = (email) =>
	new Promise((resolve, reject) => {
		try {
			
			User.findOne({ email })
				.then((user) => {
					return resolve(user);
				})
				.catch((err) => reject(err));
				
		} catch (e) {
			return reject(e);
		}
	});

// Fetch a user
const fetchUserById = (_id) =>
	new Promise((resolve, reject) => {
		try {
			
			User.findOne({ _id })
				.select('-password')
				.then((user) => {
					let data = {
						id: user.id,
						name: user.name,
						email: user.email,
						blockList: user.blockList
					}

					return resolve(data);
				})
				.catch((err) => reject(err));
				
		} catch (e) {
			return reject(e);
		}
	});

// Add user to block list
const addToBlockList = (_id, blockId) =>
	new Promise((resolve, reject) => {
		try {
			
			User.findOneAndUpdate({ _id }, { $push: { blockList : blockId}}, { new: true })
				.select('-password')
				.then((user) => {
					return resolve(user);
				})
				.catch((err) => reject(err));
				
		} catch (e) {
			return reject(e);
		}
	});

// Add user to block list
const removeFromBlockList = (_id, blockId) =>
  new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        { _id },
        { $pull: { blockList: blockId } },
        { new: true }
      )
        .select("-password")
        .then((user) => {
          return resolve(user);
        })
        .catch((err) => reject(err));
    } catch (e) {
      return reject(e);
    }
  });

// Add online user
const addOnlineUser = (id) =>
	new Promise((resolve, reject) => {
		try {
			let user = new OnlineUsers({
        userId: id,
      });

			user.save()
				.then((user) => {
					return resolve(user)
				})
		} catch (e) {
			return reject(e);
		}
	});

// Remove online user
const deleteOnlineUser = (id) =>
	new Promise((resolve, reject) => {
		try {
			OnlineUsers.findOneAndDelete({userId: ObjectIdValue(id)}, (err, doc) => {
				if(err) return reject(err)
				return resolve(doc)
			})
		} catch (e) {
			return reject(e);
		}
	});

module.exports = {
  User,
	OnlineUsers,
	addOnlineUser,
  createUser,
  fetchUserByEmail,
	deleteOnlineUser,
  fetchUserById,
  addToBlockList,
  removeFromBlockList,
};
