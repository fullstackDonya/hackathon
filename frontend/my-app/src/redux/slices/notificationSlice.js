import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.get('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.put(`/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.put('/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur serveur');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(notification => notification._id === action.payload._id);
        if (index !== -1) {
          state.list[index].read = true;
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.list.forEach(notification => {
          notification.read = true;
        });
      });
  },
});

export default notificationSlice.reducer;