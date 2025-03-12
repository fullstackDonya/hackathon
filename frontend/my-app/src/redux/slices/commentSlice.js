import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../utils/axiosConfig"; 

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    if (!token) {
      return rejectWithValue("Utilisateur non connecté");
    }

    try {
      const response = await axios.get(`/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur serveur");
    }
  }
);

export const sendComment = createAsyncThunk(
  "comments/sendComment",
  async ({ postId, commentData, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/comment`, commentData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 201) {
        throw new Error("Erreur lors de l'envoi du commentaire");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur serveur");
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: {},
    loading: false,
    error: null,
  },
  reducers: {
    addCommentToPost: (state, action) => {
      const { post, ...comment } = action.payload;
      const postId = post; 
      
      if (state.comments[postId]) {
          state.comments[postId].push(comment);
      } else {
          state.comments[postId] = [comment];
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        console.log("📩 Commentaires reçus de l'API :", action.payload);
        state.loading = false;
        state.comments[action.meta.arg] = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.comments[postId]) {
          state.comments[postId].push(comment);
        } else {
          state.comments[postId] = [comment];
        }
      });
  },
});

export const { addCommentToPost } = commentSlice.actions;
export default commentSlice.reducer;