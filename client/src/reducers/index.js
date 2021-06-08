import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import chatsReducer from './chatsReducer';

export default combineReducers({
	user: userReducer,
	auth: authReducer,
	chat: chatsReducer,
	error: errorReducer,
})