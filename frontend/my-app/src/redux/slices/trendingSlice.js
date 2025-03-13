import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const fetchTrending = createAsyncThunk(
  'trending/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/trending/hashtags');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const trendingSlice = createSlice({
  name: 'trending',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trendingSlice.reducer;