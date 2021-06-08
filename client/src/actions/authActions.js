import axios from 'axios';
import { returnErrors } from './errorActions';

import {
  USER_LOADED,
  USER_LOADING,
  USERS_LOADED,
  USERS_LOADING,
  USERS_LOADING_ERROR,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_BLOCK_SUCCESS,
  USER_BLOCK_FAIL,
  USER_UNBLOCK_SUCCESS,
  USER_UNBLOCK_FAIL
} from "./types.js";

// Check for token and load existing user
export const loadUser = () => (dispatch, getState) => {
	// Loading user
	dispatch({ type: USER_LOADING });

	axios
    .get("/api/auth/user", axiosConfig(getState))
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

// block user
export const blockUser = (id) => (dispatch, getState) => {

	const body = JSON.stringify({ id });
	axios
    .post("/api/users/block", body, axiosConfig(getState))
    .then((res) => {
      dispatch({ type: USER_BLOCK_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "USER_BLOCK_FAIL")
      );
      dispatch({ type: USER_BLOCK_FAIL });
    });
};

// block user
export const unBlockUser = (id) => (dispatch, getState) => {

	const body = JSON.stringify({ id });
	axios
    .post("/api/users/unblock", body, axiosConfig(getState))
    .then((res) => {
      dispatch({ type: USER_UNBLOCK_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "USER_UNBLOCK_FAIL")
      );
      dispatch({ type: USER_UNBLOCK_FAIL });
    });
};

// Login existing user
export const loginUser = ({ email, password }) => (dispatch, getState) => {

	const body = JSON.stringify({ email, password });
	axios
    .post("/api/auth", body, axiosConfig())
    .then((response) => {
      
      dispatch({ type: USERS_LOADING });

      axios
        .get("/api/users", axiosConfig(() => response.data.token))
        .then((res) => {
          dispatch({ type: USERS_LOADED, payload: res.data });
          dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        })
        .catch((err) => {
          dispatch({ type: LOGIN_SUCCESS, payload: response.data });
          dispatch(
            returnErrors(
              err.response.data,
              err.response.status,
              "USERS_LOADING_ERROR"
            )
          );
          dispatch({ type: USERS_LOADING_ERROR });
        });

    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
      dispatch({ type: LOGIN_FAIL });
    });
};

// Register new user
export const registerUser = ({ name, email, password }) => dispatch => {

	const body = JSON.stringify({ name, email, password });
	axios
    .post("/api/users", body, axiosConfig())
    .then((response) => {
            
      dispatch({ type: USERS_LOADING });

      axios
        .get("/api/users", axiosConfig(() => response.data.token))
        .then((res) => {
          dispatch({ type: USERS_LOADED, payload: res.data });
          dispatch({ type: REGISTER_SUCCESS, payload: response.data });
        })
        .catch((err) => {
          dispatch({ type: REGISTER_SUCCESS, payload: response.data });
          dispatch(
            returnErrors(
              err.response.data,
              err.response.status,
              "USERS_LOADING_ERROR"
            )
          );
          dispatch({ type: USERS_LOADING_ERROR });
        });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
      dispatch({ type: REGISTER_FAIL });
    });
};

// Register new user
export const logout = () => (dispatch, getState) => {
  axios
    .get("/api/auth/logout", axiosConfig(getState))
    .then(() => {            
      dispatch({ type: LOGOUT_SUCCESS });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status, 'LOGOUT_FAIL'));
      dispatch({ type: LOGOUT_FAIL });
    });
};

// Axios config
export const axiosConfig = (getState = () => '') => {
  // Request headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Get token from localStorage
  if (getState()) {
    const token =  typeof(getState()) !== 'string' ? getState().auth.token : getState();
    // Check if token is present then add to headers
    if (token) {
      config.headers["x-auth-token"] = token;
    }
  }

  return config;
}