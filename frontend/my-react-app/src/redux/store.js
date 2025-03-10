import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './slices/conversationSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import commentReducer from './slices/commentSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import contactsReducer from './slices/contactsSlice';
import postsReducer from './slices/postsSlice';
import diagnosticReducer from './slices/diagnosticSlice'




const store = configureStore({
  reducer: {
    diagnostic: diagnosticReducer,
    posts: postsReducer,
    contacts: contactsReducer,
    appointments: appointmentsReducer,
    conversations: conversationReducer,
    comments: commentReducer,
    auth: authReducer,
    users: usersReducer
  },
});

export default store;