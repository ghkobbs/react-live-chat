import {
  USERS_LOADED,
  ADD_USER,
  USERS_LOADING,
  USERS_LOADING_ERROR,
} from "../actions/types";

const initialState = {
	users: [],
	loading: false
}

export default function userReducer(state = initialState, action) {
	switch (action.type) {
    case USERS_LOADED:
      return {
        ...state,
        users: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
    case USERS_LOADING_ERROR:
      return {
        ...state,
				users: [],
        loading: true,
      };
    case USERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }

}