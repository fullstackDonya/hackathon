import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

// Action pour récupérer uniquement la liste des utilisateurs connectés
export const fetchConnectedUsers = createAsyncThunk(
  "users/fetchConnectedUsers",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth; 
    
    if (!token) {
      return rejectWithValue("Utilisateur non connecté");
    }

    try {
      const response = await axios.get(`/connected`, {
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

// Action pour récupérer les informations de l'utilisateur
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

// Action pour récupérer la liste des utilisateurs
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);


export const register = createAsyncThunk(
  "auth/register",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post("/register", user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, username, email, authToken }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/update/${id}`,
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      
      .addCase(fetchConnectedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConnectedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.connectedUsers = action.payload;
      })
      .addCase(fetchConnectedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;