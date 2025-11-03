import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCinemas } from '../api/cinemas';
import { Cinema} from "../api/types";

export const loadCinemas = createAsyncThunk('cinemas/load', async () => {
    return await fetchCinemas();
});

const cinemasSlice = createSlice({
    name: 'cinemas',
    initialState: {
        items: [] as Cinema[],
        loading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadCinemas.pending, state => {
                state.loading = true;
            })
            .addCase(loadCinemas.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(loadCinemas.rejected, state => {
                state.loading = false;
            });
    },
});

export default cinemasSlice.reducer;
