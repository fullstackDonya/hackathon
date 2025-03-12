import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const likePost = createAsyncThunk(
  'likes/likePost',
  async ({ postId, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/post/like', { postId }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return { postId, user: response.data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'likes/unlikePost',
  async ({ postId, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/post/unlike', { postId }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return { postId, user: response.data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const likeComment = createAsyncThunk(
  'likes/likeComment',
  async ({ commentId, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/comment/like', { commentId }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return { commentId, user: response.data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'likes/unlikeComment',
  async ({ commentId, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/comment/unlike', { commentId }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return { commentId, user: response.data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const fetchLikes = createAsyncThunk(
  'likes/fetchLikes',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/post/${postId}/likes`);
      return { postId, likes: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const fetchCommentLikes = createAsyncThunk(
  'likes/fetchCommentLikes',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/comment/${commentId}/likes`);
      return { commentId, likes: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: {},
    commentLikes: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, user } = action.payload;
        if (!state.likes[postId]) {
          state.likes[postId] = [];
        }
        state.likes[postId].push({ user });
        state.loading = false;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, user } = action.payload;
        if (state.likes[postId]) {
          state.likes[postId] = state.likes[postId].filter(like => like.user !== user);
        }
        state.loading = false;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const { commentId, user } = action.payload;
        if (!state.commentLikes[commentId]) {
          state.commentLikes[commentId] = [];
        }
        state.commentLikes[commentId].push({ user });
        state.loading = false;
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unlikeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { commentId, user } = action.payload;
        if (state.commentLikes[commentId]) {
          state.commentLikes[commentId] = state.commentLikes[commentId].filter(like => like.user !== user);
        }
        state.loading = false;
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        state.likes[postId] = likes;
        state.loading = false;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCommentLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentLikes.fulfilled, (state, action) => {
        const { commentId, likes } = action.payload;
        state.commentLikes[commentId] = likes;
        state.loading = false;
      })
      .addCase(fetchCommentLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;