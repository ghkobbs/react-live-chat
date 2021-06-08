import axios from 'axios';
import {
  USERS_LOADED,
  ADD_USER,
  USERS_LOADING,
  USERS_LOADING_ERROR,
} from "./types";
import { returnErrors } from './errorActions';
import { axiosConfig } from './authActions';

// Check for token and load existing user
export const getUsers = () => (dispatch, getState) => {
  // Loading user
  dispatch({ type: USERS_LOADING });

  axios
    .get("/api/users", axiosConfig(getState))
    .then((res) => {
      dispatch({ type: USERS_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "USERS_LOADING_ERROR"
        )
      );
      dispatch({ type: USERS_LOADING_ERROR });
    });
};

export const addUser = user => dispatch => {
	axios
		.post('/api/users', user )
		.then(res => dispatch({ type: ADD_USER, payload: res.data }))
};

export const setUsersLoading = () => {
	return {
		type: USERS_LOADING
	}
}