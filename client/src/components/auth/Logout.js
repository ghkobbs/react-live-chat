import React, { useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from '../../actions/authActions';
import { getUsers } from '../../actions/userActions';
import store from  '../../store';
import { BACKEND_URL } from "../../config/default";
import io from "socket.io-client";


let socket;
const Logout = function({logout}) {

  useEffect(() => {
    socket = io(BACKEND_URL);
    
    const logoutListner = (...data) => {
      setTimeout(() => {
        logout();
        store.dispatch(getUsers());
      }, 5000)
    };

    socket.on("UserLogout", logoutListner);

    return () => {
      socket.off("UserLogout", logoutListner);
    };
  });

  const logoutUser = () => {
    logout();
    socket.disconnect();
    store.dispatch(getUsers());
  }

	return (
    <>
      <div className="button-wrapper">
        <button type="button" onClick={logoutUser}>
          Logout
        </button>
      </div>
    </>
  );

}

Logout.propTypes = {
	logout: PropTypes.func.isRequired
};


const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user,
  currentUser: state.auth.user,
});


export default connect(mapStateToProps, { logout })(Logout);