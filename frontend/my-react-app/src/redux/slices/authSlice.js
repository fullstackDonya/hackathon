import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', credentials);
      // console.log("Login response:", response.data); // Vérifiez si userId est bien présent
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      return true;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },
    clearCredentials: (state) => {
      state.userId = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Stockage local:", {
          token: localStorage.getItem('token'),
          userId: localStorage.getItem('userId'),
          role: localStorage.getItem('role')
        });
        state.loading = false;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.role = action.payload.role; 
        localStorage.setItem('userId', action.payload.userId);
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userId = null;
        state.token = null;
        state.role = null;
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;