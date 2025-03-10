import { configureStore } from '@reduxjs/toolkit';
import commentReducer from './slices/commentSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import postsReducer from './slices/postsSlice';




const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentReducer,
    auth: authReducer,
    users: usersReducer
  },
});

export default store;