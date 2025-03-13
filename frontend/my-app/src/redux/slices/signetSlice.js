import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

const initialState = {
    signets: [],
    loading: false,
    error: null,
};

export const getUserSignets = createAsyncThunk(
    'signets/getUserSignets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/signets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;  // On suppose que la réponse contient un tableau des signets de l'utilisateur
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
                '/signet',  
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
            const response = await axios.delete(`/signet`, {  
                data: { postId },
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
            .addCase(getUserSignets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserSignets.fulfilled, (state, action) => {
                state.loading = false;
                state.signets = action.payload;
            })
            .addCase(getUserSignets.rejected, (state, action) => {
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
