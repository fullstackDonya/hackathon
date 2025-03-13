import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const retweetPost = createAsyncThunk(
  'retweets/retweetPost',
  async ({ postId, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/retweet', { postId }, {
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

export const unretweetPost = createAsyncThunk(
  'retweets/unretweetPost',
  async ({ postId, authToken }, { rejectWithValue }) => {
    try {
      await axios.delete('/retweet', {
        data: { postId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return { postId };  // Retourne l'ID du post pour mettre à jour l'état
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const fetchRetweets = createAsyncThunk(
  'retweets/fetchRetweets',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/post/${postId}/retweets`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const retweetSlice = createSlice({
  name: 'retweets',
  initialState: {
    retweets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retweetPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(retweetPost.fulfilled, (state, action) => {
        state.loading = false;
        state.retweets.push(action.payload);
      })
      .addCase(retweetPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unretweetPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(unretweetPost.fulfilled, (state, action) => {
        state.loading = false;
        state.retweets = state.retweets.filter(retweet => retweet.post._id !== action.payload.postId);
      })
      .addCase(unretweetPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRetweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRetweets.fulfilled, (state, action) => {
        state.loading = false;
        state.retweets = action.payload;
      })
      .addCase(fetchRetweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default retweetSlice.reducer;