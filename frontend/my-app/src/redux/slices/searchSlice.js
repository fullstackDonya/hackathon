import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
  results: [],
  loading: false,
  error: null,
};

export const searchPosts = createAsyncThunk(
  'search/searchPosts',
  async ({ searchTerm }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/search?term=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;