import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMyBookings } from '../store/bookingSlice';
import { loadMovies } from '../store/moviesSlice';
import { loadSessionsByMovieId } from '../store/movieSessionsSlice';
import {Booking, MovieSession} from '../api/types';
import { fetchSettings } from '../api/settings';
import { useNavigate } from 'react-router-dom';
import BookingCard from "./BookingCard";

const MyTickets: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const bookings = useAppSelector(state => state.bookings.items);
    const movies = useAppSelector(state => state.movies.items);
    const sessionsByMovie = useAppSelector(state => state.movieSessions.byMovieId);
    const sessionsByCinema = useAppSelector(state => state.cinemaSessions.byCinemaId);
    const loading = useAppSelector(state => state.bookings.loading);

    const [bookingPaymentTimeSeconds, setBookingPaymentTimeSeconds] = useState<number>(0);

    useEffect(() => {
        dispatch(loadMyBookings());
        if (movies.length === 0) dispatch(loadMovies());
        fetchSettings().then(data => {
            setBookingPaymentTimeSeconds(data.bookingPaymentTimeSeconds);
        });
    }, [dispatch, movies.length]);

    const allSessions = useMemo(() => {
        return [
            ...Object.values(sessionsByMovie).flat(),
            ...Object.values(sessionsByCinema).flat(),
        ];
    }, [sessionsByMovie, sessionsByCinema]);

    useEffect(() => {
        const missingMovieIds = bookings
            .map(b => {
                const session = allSessions.find(s => s.id === b.movieSessionId);
                return session?.movieId;
            })
            .filter((id): id is number => typeof id === 'number' && !sessionsByMovie[id]);

        Array.from(new Set(missingMovieIds)).forEach(movieId => {
            dispatch(loadSessionsByMovieId(movieId));
        });
    }, [bookings, allSessions, sessionsByMovie, dispatch]);

    const now = new Date();
    const unpaid = bookings.filter(b => !b.isPaid);
    const future = bookings.filter(b => b.isPaid && new Date(b.bookedAt) >= now);
    const past = bookings.filter(b => b.isPaid && new Date(b.bookedAt) < now);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Мои билеты</h2>

            <h3>Не оплаченные</h3>
            <hr />
            {unpaid.length === 0 ? (
                <p>Нет неоплаченных билетов</p>
            ) : (
                unpaid.map(b => {
                    const session = allSessions.find(s => s.id === b.movieSessionId);
                    const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                    return (
                        <BookingCard
                            key={b.id}
                            booking={b}
                            session={session as MovieSession}
                            movie={movie}
                            bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                        />
                    );
                })
            )}

            <h3 style={{ marginTop: '30px' }}>Будущие</h3>
            <hr />
            {future.length === 0 ? (
                <p>Нет будущих билетов</p>
            ) : (
                future.map(b => {
                    const session = allSessions.find(s => s.id === b.movieSessionId);
                    const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                    return (
                        <BookingCard
                            key={b.id}
                            booking={b}
                            session={session as MovieSession}
                            movie={movie}
                            bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                        />
                    );
                })
            )}

            <h3 style={{ marginTop: '30px' }}>Прошедшие</h3>
            <hr />
            {past.length === 0 ? (
                <p>Нет прошедших билетов</p>
            ) : (
                past.map(b => {
                    const session = allSessions.find(s => s.id === b.movieSessionId);
                    const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                    return (
                        <BookingCard
                            key={b.id}
                            booking={b}
                            session={session as MovieSession}
                            movie={movie}
                            bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                        />
                    );
                })
            )}
        </div>
    );
};

export default MyTickets;
