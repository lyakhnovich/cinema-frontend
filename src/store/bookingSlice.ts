import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMyBookings } from '../api/bookings';
import { Booking } from '../api/types';

export const loadMyBookings = createAsyncThunk('bookings/load', async () => {
    return await fetchMyBookings();
});

type BookingsState = {
    items: Booking[];
    loading: boolean;
};

const initialState: BookingsState = {
    items: [],
    loading: false,
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadMyBookings.pending, state => {
                state.loading = true;
            })
            .addCase(loadMyBookings.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(loadMyBookings.rejected, state => {
                state.loading = false;
            });
    },
});

export default bookingsSlice.reducer;
