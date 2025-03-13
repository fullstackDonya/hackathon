import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
    signets: [],
    loading: false,
    error: null,
};

// Actions asynchrones
export const fetchSignets = createAsyncThunk(
    'signets/fetchSignets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/signets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erreur serveur');
        }
    }
);

export const addSignet = createAsyncThunk(
    'signets/addSignet',
    async ({ postId, authToken }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                '/signets',
                { postId },
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

export const removeSignet = createAsyncThunk(
    'signets/removeSignet',
    async ({ postId, authToken }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/signets/${postId}`, {
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

const signetSlice = createSlice({
    name: 'signets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSignets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSignets.fulfilled, (state, action) => {
                state.loading = false;
                state.signets = action.payload;
            })
            .addCase(fetchSignets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addSignet.fulfilled, (state, action) => {
                state.signets.push(action.payload);
            })
            .addCase(removeSignet.fulfilled, (state, action) => {
                state.signets = state.signets.filter(signet => signet.post._id !== action.payload.postId);
            });
    },
});

export default signetSlice.reducer;