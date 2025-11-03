import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import movieSessionsReducer from './movieSessionsSlice';
import cinemasReducer from './cinemasSlice';
import cinemaSessionsReducer from './cinemaSessionsSlice';
import bookingsReducer from './bookingSlice';

export const store = configureStore({
    reducer: {
        bookings: bookingsReducer,
        movies: moviesReducer,
        cinemas: cinemasReducer,
        movieSessions: movieSessionsReducer,
        cinemaSessions: cinemaSessionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
