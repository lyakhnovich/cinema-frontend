import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSessionsByCinemaId } from '../api/cinemas';
import { Session } from '../api/types';

export const loadSessionsByCinemaId = createAsyncThunk(
    'cinemaSessions/loadByCinemaId',
    async (cinemaId: number) => {
        const sessions = await fetchSessionsByCinemaId(cinemaId);
        return { cinemaId, sessions };
    }
);

type CinemaSessionsState = {
    byCinemaId: Record<number, Session[]>;
    loading: boolean;
};

const initialState: CinemaSessionsState = {
    byCinemaId: {},
    loading: false,
};

const cinemaSessionsSlice = createSlice({
    name: 'cinemaSessions',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadSessionsByCinemaId.pending, state => {
                state.loading = true;
            })
            .addCase(loadSessionsByCinemaId.fulfilled, (state, action) => {
                const { cinemaId, sessions } = action.payload;
                state.byCinemaId[cinemaId] = sessions;
                state.loading = false;
            })
            .addCase(loadSessionsByCinemaId.rejected, state => {
                state.loading = false;
            });
    },
});

export default cinemaSessionsSlice.reducer;
