import React, { useEffect } from 'react';

import '../styles/style.css';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { authorizeAuth0User } from "../../actions/authActions";
import { getUsers } from "../../actions/userActions";
import { clearErrors } from '../../actions/errorActions';
import { REDIRECT_URI, DOMAIN, CLIENT_ID, AUDIENCE } from "../../config/default";

const Auth = function ({ error, authorizeAuth0User, isAuthenticated, clearErrors }) {
  const authorizeNewAuth0User = async () => {
    clearErrors();

    const responseType = "code";

    const response = await fetch(
      `https://${DOMAIN}/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&audience=${AUDIENCE}` +
        `&response_type=${responseType}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&scope=openid profile email`,
      {
        redirect: "manual",
      }
    );

    window.location.replace(response.url);
  };

  const code = window.location.href.split("=")[1];

  useEffect(() => {
    if (code && isAuthenticated === false) {
      authorizeAuth0User(code);
    }
  }, [code, isAuthenticated]);

  return (
    <div className="auth-outer-wrapper">
      <div className="auth-inner-wrapper">
        <div className="container">
          <div className="auth-wrapper">
            <div className="auth-login-wrapper">
              {error.id === "LOGIN_FAIL" ? (
                <div className="alert alert__danger">
                  <p>{error.error.error}</p>
                </div>
              ) : null}
              <h2>Login</h2>
              <p>You must login first to continue. Click the button below to log in with your auth0 account.</p>
              <div className="button-wrapper">
                <button type="button" onClick={authorizeNewAuth0User}>
                  Log in with Auth0
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


Auth.propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  authorizeAuth0User: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { clearErrors, getUsers, authorizeAuth0User })(Auth);
