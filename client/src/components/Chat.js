import React, { useEffect, useState } from 'react';
import UserLists from './UsersList';
import Logout from './auth/Logout';
import  { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useForm from '../lib/useForm';
import { addChat, getChats } from '../actions/chatsActions';
import { clearErrors } from '../actions/errorActions';
import io from 'socket.io-client';
import { BACKEND_URL } from  '../config/default';

import './styles/style.css';

let socket;

const Chat = function ({ error, messages, user, currentUser, addChat, getChats, clearErrors }) {

  const { inputs, handleChange, clearForm } = useForm({
    message: ''
  });
  
  const [receipient, setReceipient] = useState('');
  const [showOnlineUsers, setShowOnlineUsers] = useState(true);

  useEffect(() => {
    socket = io(BACKEND_URL);
    socket.on("showChatMessages", (data) => {
      getChats(data.user.id);
    });
  });

  useEffect(() => {
    const chatScreen = document.querySelector(".chat-messages");

    if (messages && messages.length > 5) {
      chatScreen.scrollTo({
        top: messages.length * 1150,
        behavior: "smooth",
      });
    }
  });

	useEffect(() => {
    socket.emit("loggedIn", { user });

    return () => {
      socket.off();
    };

  }, [user]);
  

  // useEffect(() => {
  // })

  function sendMessage(e) {
    e.preventDefault();

    if (inputs.message) {
      clearErrors();

      addChat(receipient, inputs);
      getChats(receipient);
      socket.emit("chatMessage", { user, inputs });
      clearForm();
    }
  }
  

  return (
    <div className="chat-outer-wrapper">
      <div className="chat-inner-wrapper">
        <div className="container">
          <div className="chat-button-groups">
            <div className="button-wrapper">
              <button
                type="button"
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              >
                {showOnlineUsers ? "Hide Online Users" : "Show Online Users"}
              </button>
            </div>
            <Logout />
          </div>
          <div
            className={
              showOnlineUsers ? "chat-layout" : "chat-layout hide-online-users"
            }
          >
            <div className="chat-sidebar">
              <div className="current-user-wrapper">
                <div>
                  Signed in as: <strong>{user.email}</strong>
                  <br />
                  Blocked Users ({currentUser.blockList?.length || 0})
                </div>
              </div>
              <ul className="chat-users">
                <UserLists
                  setShowOnlineUsers={setShowOnlineUsers}
                  showOnlineUsers={showOnlineUsers}
                  setReceipient={setReceipient}
                />
              </ul>
            </div>
            <div className="chat-messages-wrapper">
              <div className="chat-messages">
                {messages && messages.length > 0
                  ? messages.map((message) =>
                      message.receiver._id === user.id ? (
                        <div
                          key={message._id}
                          className="bubble-wrapper bubble-wrapper__left"
                        >
                          <div className="message-bubble">
                            <p>{message.message}</p>
                          </div>
                          <small>
                            {new Intl.DateTimeFormat("en-GB", {
                              dateStyle: "short",
                              timeStyle: "long",
                            }).format(new Date(message.created))}
                          </small>
                        </div>
                      ) : (
                        <div
                          key={message._id}
                          className="bubble-wrapper bubble-wrapper__right"
                        >
                          <div className="message-bubble">
                            <p>{message.message}</p>
                          </div>
                          <small>
                            {new Intl.DateTimeFormat("en-GB", {
                              dateStyle: "short",
                              timeStyle: "long",
                            }).format(new Date(message.created))}
                          </small>
                        </div>
                      )
                    )
                  : messages && messages.length === 0
                  ? error.id === "USER_CHATS_FAIL"
                    ? error.error.error
                    : null
                  : "Beginning of something new"}
              </div>
              <div className="chat-input-area">
                <form onSubmit={sendMessage}>
                  <div className="input-wrapper">
                    <textarea
                      name="message"
                      onChange={handleChange}
                      value={inputs.message}
                    />
                  </div>
                  <div className="button-wrapper">
                    <button type="submit">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  addChat: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
  currentUser: state.auth.user,
  user: state.auth.user,
  error: state.error
});

export default connect(mapStateToProps, { addChat, getChats, clearErrors })(Chat);
