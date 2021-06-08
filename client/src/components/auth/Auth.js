import React, { useEffect } from 'react';

import '../styles/style.css';
import useForm from '../../lib/useForm';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { registerUser, loginUser } from "../../actions/authActions";
import { getUsers } from "../../actions/userActions";
import { clearErrors } from '../../actions/errorActions';

const Auth = function ({ error, registerUser, loginUser, clearErrors }) {
  const { inputs, handleChange } = useForm({});

  const registerNewUser = (e) => {

    clearErrors();

    e.preventDefault();

    const { name, register_email, register_password } = inputs;

    const newUser = {
      name,
      email: register_email,
      password: register_password,
    };

    // Attempt to register new user
    registerUser(newUser);
  };

  const loginExistingUser = (e) => {

    clearErrors();

    e.preventDefault();

    const { email, password } = inputs;

    const user = {
      email,
      password,
    };

    // Attempt to register new user
    loginUser(user);
  };

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
              <form onSubmit={loginExistingUser}>
                <div className="input-wrapper">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={inputs.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="button-wrapper">
                  <button type="submit">Log in</button>
                </div>
              </form>
            </div>
            <div className="auth-register-wrapper">
              {error.id === "REGISTER_FAIL" ? (
                <div className="alert alert__danger">
                  <p>{error.error.error}</p>
                </div>
              ) : null}
              <h2>Register</h2>
              <form onSubmit={registerNewUser}>
                <div className="input-wrapper">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={inputs.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="register_email">Email</label>
                  <input
                    type="text"
                    name="register_email"
                    id="register_email"
                    placeholder="Email"
                    value={inputs.register_email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="register_password">Password</label>
                  <input
                    type="password"
                    name="register_password"
                    id="register_password"
                    placeholder="Password"
                    value={inputs.register_password}
                    onChange={handleChange}
                  />
                </div>
                <div className="button-wrapper">
                  <button type="submit">Register</button>
                </div>
              </form>
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
  registerUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { registerUser, loginUser, clearErrors, getUsers })(Auth);
