import React, { useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from '../../actions/authActions';
import { getUsers } from '../../actions/userActions';
import store from  '../../store';
import { BACKEND_URL, REDIRECT_URI, DOMAIN, CLIENT_ID } from "../../config/default";
import io from "socket.io-client";

let socket;
let response;
const Logout = function({logout, user}) {

  useEffect(() => {
    socket = io(BACKEND_URL);
    socket.on("UserLogout", (data) => {
      store.dispatch(getUsers());
    });

  },[]);
  
  const logoutUser = async () => {
    response = await fetch(
      `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&returnTo=${REDIRECT_URI}`,
      { redirect: "manual" }
    );

    socket.disconnect();
    logout();
    store.dispatch(getUsers());
    
  }

  useEffect(() => {
    if (response) {
      setTimeout(() => {
        window.location.replace(response.url);
      }, 5000)
    }
  }, [user]);

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
	logout: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user,
  currentUser: state.auth.user,
});


export default connect(mapStateToProps, { logout })(Logout);