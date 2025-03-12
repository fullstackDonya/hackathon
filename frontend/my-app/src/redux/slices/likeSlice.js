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
      return response.data;
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: [],
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
        state.loading = false;
        state.likes.push(action.payload);
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = state.likes.filter(like => like._id !== action.payload._id);
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;