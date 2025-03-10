import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../utils/axiosConfig"; 

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { getState, rejectWithValue }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) {
      return rejectWithValue("Utilisateur non connecté");
    }

    try {
      const response = await axios.get(`/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur serveur");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ sender, conversationId, content }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`/send`, { sender, conversation : conversationId, content }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 201) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur serveur");
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: {},
    loading: false,
    error: null,
  },
  reducers: {
    addMessageToConversation: (state, action) => {
      const { conversation, ...message } = action.payload;
      const conversationId = conversation; 
      
      if (state.messages[conversationId]) {
          state.messages[conversationId].push(message);
      } else {
          state.messages[conversationId] = [message];
      }
      
        if (state.messages[conversationId]) {
            state.messages[conversationId].push(message);
        } else {
            state.messages[conversationId] = [message];
        }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        console.log("📩 Messages reçus de l'API :", action.payload);
        state.loading = false;
        state.messages[action.meta.arg] = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (state.messages[conversationId]) {
          state.messages[conversationId].push(message);
        } else {
          state.messages[conversationId] = [message];
        }
      });
  },
});

export const { addMessageToConversation } = messageSlice.actions;
export default messageSlice.reducer;