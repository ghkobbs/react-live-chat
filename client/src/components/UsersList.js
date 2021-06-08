import React, { useEffect } from "react";
import { connect } from "react-redux";
import store from "../store";
import { getUsers } from "../actions/userActions";
import { blockUser, unBlockUser, loadUser } from "../actions/authActions";
import { getChats } from "../actions/chatsActions";
import io from "socket.io-client";
import { BACKEND_URL } from "../config/default";

import PropTypes from "prop-types";

let socket;
const UsersList = function (props) {
  
  const {
    user,
    getChats,
    blockUser,
    unBlockUser,
    currentUser,
    setReceipient
  } = props;

  function fetchUserChats(e){
    e.preventDefault();
    if( e.target.localName !== 'button') {
      let id;

      if(e.target.localName !== 'li') {
        id = e.target.parentElement.dataset.id;
      } else {
        id = e.target.dataset.id;
      }
      
      setReceipient(id);
      getChats(id);
    }
  }

  function addToBlockList(e){
    e.preventDefault();
    let id;

    if(e.target.localName === 'button') {
      id = e.target.dataset.id;
      blockUser(id);
      store.dispatch(loadUser());
    }    
  }

  function removeFromBlockList(e){
    e.preventDefault();
    let id;

    if(e.target.localName === 'button') {
      id = e.target.dataset.id;
      unBlockUser(id);
      store.dispatch(loadUser());
    }    
  }

	useEffect(() => {
    store.dispatch(getUsers());
	}, [])

	useEffect(() => {
    socket = io(BACKEND_URL);
    if( user ) {
      socket.on("welcome", (data) => {
        store.dispatch(getUsers());
      });
    }
	}, [user])

  return (
    <>
      {user &&
        user.users.length > 1 ? (
          user.users.map(({ userId: { _id, name, email, blockList } }) =>
            _id !== currentUser.id ? (
              !blockList?.includes(currentUser.id) ? (
                <li
                  key={_id}
                  className={_id === currentUser.id ? "chat-users-item current":"chat-users-item"}
                  data-id={_id}
                  onClick={fetchUserChats}
                >
                  <h3>{name}</h3>
                  <small>
                    {email}
                  </small>
                  {currentUser.blockList?.includes(_id) ? (
                    <button data-id={_id} onClick={removeFromBlockList}>
                      Unblock
                    </button>
                  ) : (
                    <button data-id={_id} onClick={addToBlockList}>
                      Block
                    </button>
                  )}
                </li>
              ) : (
                null
              )
            ) : (
              null
            )
        )
      ):(
        "There are no users online at the moment"
      )}
    </>
  );
};

UsersList.propTypes = {
  getChats: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  currentUser: state.auth.user,
  messages: state.chat.messages,
});

export default connect(mapStateToProps, { getChats, blockUser, unBlockUser })(
  UsersList
);
