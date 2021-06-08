import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, USER_BLOCK_SUCCESS, USER_BLOCK_FAIL, USER_UNBLOCK_SUCCESS, USER_UNBLOCK_FAIL } from '../actions/types.js';

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	isLoading: false,
	user: null
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_BLOCK_SUCCESS:
    case USER_UNBLOCK_SUCCESS:
      return state
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case USER_BLOCK_FAIL:
    case USER_UNBLOCK_FAIL:
      localStorage.setItem(
        "token",
        action.payload?.token || localStorage.getItem("token")
      );
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("receiver");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}