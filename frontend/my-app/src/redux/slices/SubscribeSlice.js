import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axiosConfig';

// Action pour suivre un utilisateur
export const followUser = createAsyncThunk("subscription/follow", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.post('/follow', { userId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Action pour se désabonner
export const unfollowUser = createAsyncThunk("subscription/unfollow", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.post('/unfollow', { userId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Action pour récupérer les utilisateurs suivis
export const fetchFollowing = createAsyncThunk("subscription/fetchFollowing", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/following');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Action pour récupérer les followers
export const fetchFollowers = createAsyncThunk("subscription/fetchFollowers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/followers');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    following: [],
    followers: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearFollowing: (state) => {
      state.following = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following.push(action.meta.arg); // Ajouter l'ID de l'utilisateur suivi
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following = state.following.filter((id) => id !== action.meta.arg); // Retirer l'ID de l'utilisateur
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.following = action.payload.map(follow => follow.following._id);
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFollowers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followers = action.payload.map(follow => follow.follower._id);
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearFollowing } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;