const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const server = http.createServer(app);
const io = socketio(server);

const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://localhost/livechat';

mongoose
	.connect(MONGO_DB_URI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	// eslint-disable-next-line
	.then(() => console.log('Database connected!'))
	// eslint-disable-next-line
	.catch((err) => console.error('Could not connect to database', err));

// Routes
app.use('/api/users', require('./users/route'));
app.use('/api/auth', require('./auth/route'));
app.use('/api/chat', require('./chat/route'));

// Serve static assets if we are in production
if(process.env.NODE_ENV === 'production') {
	//Set a static folder
	app.use(express.static('client/build'));

	app.get('*', (req,res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
	})
}

process.on('unhandledRejection', (reason, promise) => {
	// eslint-disable-next-line
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
	// console.log(reason);
	// Application specific logging, throwing an error, or other logic here
});

// eslint-disable-next-line
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));

io.on("connection", (socket) => {

	socket.on('loggedIn', ({ user }) => {
		socket.emit("welcome", `Welcome ${user.name}`);
		socket.broadcast.emit("welcome", `${user.name} is online.`);
	});

  socket.on("chatMessage", (data) => {
    socket.broadcast.emit("showChatMessages", data);
  });

	socket.on("disconnect", (reason) => {
    socket.emit("UserLogout", reason);
  });

});

