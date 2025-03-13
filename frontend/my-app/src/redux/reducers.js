import { combineReducers } from 'redux';
import commentReducer from './slices/commentSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import postsReducer from './slices/postsSlice';
import notificationReducer from './slices/notificationSlice';
import likesReducer from './slices/likeSlice';
import retweetReducer from './slices/retweetSlice';
import signetReducer from './slices/signetSlice';
import searchReducer from './slices/searchSlice';
import subscriptionReducer from './slices/SubscribeSlice'; // Correction de l'importation

const rootReducer = combineReducers({
  posts: postsReducer,
  comments: commentReducer,
  auth: authReducer,
  users: usersReducer,
  notifications: notificationReducer,
  likes: likesReducer,
  retweets: retweetReducer,
  signets: signetReducer,
  search: searchReducer,
  subscription: subscriptionReducer,
});

export default rootReducer;