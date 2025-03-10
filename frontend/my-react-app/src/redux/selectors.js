import { createSelector } from 'reselect';

const selectAuthState = (state) => state.auth;
export const selectUsers = (state) => state.users.list; 

export const selectUserId = createSelector(
  [selectAuthState],
  (authState) => authState.userId
);

const selectConversationsState = (state) => state.conversations;

export const selectConversations = createSelector(
  [selectConversationsState],
  (conversationsState) => conversationsState.conversations
);


const selectMessagesState = (state) => state.messages;

export const selectSelectedConversationId = createSelector(
  [selectConversationsState],
  (conversationsState) => conversationsState.selectedConversationId
);

export const selectMessagesByConversationId = createSelector(
  [selectMessagesState, selectSelectedConversationId],
  (messagesState, conversationId) => {
    console.log("📌 conversationId dans le sélecteur :", conversationId);
    console.log("📌 Messages stockés :", messagesState.messages);

    if (!conversationId) return []; // 🔹 Évite les erreurs si `conversationId` est null
    return messagesState.messages[conversationId] || [];
  }
);


// export const selectConnectedUsers = createSelector(
//   [selectUsers],
//   (usersState) => usersState.connectedUsers
// );