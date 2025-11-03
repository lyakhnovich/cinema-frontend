import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Session } from '../api/types';
import {fetchMovies, fetchSessionsByMovieId} from "../api/movies";

export const loadMovies = createAsyncThunk('movies/load', async () => {
    return await fetchMovies();
});

export const loadSessionsByMovieId = createAsyncThunk(
    'sessions/loadByMovieId',
    async (movieId: number) => {
        const sessions = await fetchSessionsByMovieId(movieId);
        return { movieId, sessions };
    }
);

type SessionsState = {
    byMovieId: Record<number, Session[]>;
    loading: boolean;
};

const initialState: SessionsState = {
    byMovieId: {},
    loading: false,
};

const movieSessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadSessionsByMovieId.pending, state => {
                state.loading = true;
            })
            .addCase(loadSessionsByMovieId.fulfilled, (state, action) => {
                const { movieId, sessions } = action.payload;
                state.byMovieId[movieId] = sessions;
                state.loading = false;
            })
            .addCase(loadSessionsByMovieId.rejected, state => {
                state.loading = false;
            });
    },
});

export default movieSessionsSlice.reducer;
