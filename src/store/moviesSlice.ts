import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovies } from '../api/movies';
import { Movie } from '../api/types';

export const loadMovies = createAsyncThunk('movies/load', async () => {
    return await fetchMovies();
});

type MoviesState = {
    items: Movie[];
    selectedMovie: Movie | null;
    loading: boolean;
};

const initialState: MoviesState = {
    items: [],
    selectedMovie: null,
    loading: false,
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    },
});

export default moviesSlice.reducer;
