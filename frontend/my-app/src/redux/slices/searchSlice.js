import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action pour rechercher des posts en fonction d'un terme
export const searchPosts = createAsyncThunk(
  "search/fetchPosts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8082/search?searchTerm=${searchTerm}`);
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Erreur lors de la recherche");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
