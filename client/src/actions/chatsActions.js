import axios from 'axios';
import {
  USER_CHATS_LOADING,
  USER_CHATS_SUCCESS,
  USER_CHATS_FAIL,
  ADD_USER_CHAT_SUCCESS,
  ADD_USER_CHAT_FAIL,
} from "./types";
import { returnErrors } from './errorActions';
import { axiosConfig } from './authActions';

// Check for token and load existing user
export const getChats = (id) => (dispatch, getState) => {
  // Loading user
  dispatch({ type: USER_CHATS_LOADING });
  axios
    .get(`/api/chat/${id}`, axiosConfig(getState))
    .then((res) => {
      dispatch({ type: USER_CHATS_SUCCESS, recipient: id, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "USER_CHATS_FAIL")
      );
      dispatch({ type: USER_CHATS_FAIL });
    });
};

// Add chat
export const addChat = (id, { message }) => (dispatch, getState) => {
  const body = JSON.stringify({ message });
  axios
    .post(`/api/chat/${id}`, body, axiosConfig(getState))
    .then((res) => {
      dispatch({ type: ADD_USER_CHAT_SUCCESS,  recipient: id, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_USER_CHAT_FAIL"
        )
      );
      dispatch({ type: ADD_USER_CHAT_FAIL });
    });
};