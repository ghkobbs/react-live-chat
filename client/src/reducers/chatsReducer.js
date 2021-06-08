import {
  USER_CHATS_LOADING,
  USER_CHATS_SUCCESS,
  USER_CHATS_FAIL,
  ADD_USER_CHAT_SUCCESS,
} from "../actions/types";

const initialState = {
  messages: [],
  recipient: localStorage.getItem("receiver"),
  loading: false,
};

export default function chatsReducer(state = initialState, action) {
	switch (action.type) {
    case USER_CHATS_SUCCESS:
      localStorage.setItem(
        "receiver",
        localStorage.getItem("receiver") || action.recipient
      );
      return {
        ...state,
        messages: action.payload,
        recipient: action.recipient,
        loading: false,
      };
    case USER_CHATS_FAIL:
      return {
        ...state,
        messages: [],
        loading: false,
      };
    case USER_CHATS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADD_USER_CHAT_SUCCESS:
      return {
        ...state,
        messages: [action.payload, ...state.messages],
        recipient: action.recipient,
        loading: false,
      };
    default:
      return state;
  }

}