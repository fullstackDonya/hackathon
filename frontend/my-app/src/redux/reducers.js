import { combineReducers } from 'redux';
import commentReducer from './slices/commentSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import postsReducer from './slices/postsSlice';
import notificationReducer from './slices/notificationSlice';
import likesReducer from './slices/likeSlice';
import retweetReducer from './slices/retweetSlice';
import signetReducer from './slices/signetSlice';
import search from './slices/searchSlice';


const rootReducer = combineReducers({
  posts: postsReducer,
  comments: commentReducer,
  auth: authReducer,
  users: usersReducer,
  notifications: notificationReducer,
  likes: likesReducer,
  retweets: retweetReducer,
  signets: signetReducer,
  search: search
});

export default rootReducer;