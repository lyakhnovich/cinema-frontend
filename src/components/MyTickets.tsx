import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMyBookings } from '../store/bookingSlice';
import { loadMovies } from '../store/moviesSlice';
import { loadSessionsByMovieId } from '../store/movieSessionsSlice';
import { MovieSession } from '../api/types';
import { fetchSettings } from '../api/settings';
import BookingCard from "./BookingCard";
import {loadSessionsByCinemaId} from "../store/cinemaSessionsSlice";
import {loadCinemas} from "../store/cinemasSlice";
import {getToken} from "../store/authSlice";
import {useNavigate} from "react-router-dom";

const MyTickets: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(state => state.bookings.items);
    const movies = useAppSelector(state => state.movies.items);
    const cinemas = useAppSelector(state => state.cinemas.items);
    const sessionsByMovie = useAppSelector(state => state.movieSessions.byMovieId);
    const sessionsByCinema = useAppSelector(state => state.cinemaSessions.byCinemaId);
    const [bookingPaymentTimeSeconds, setBookingPaymentTimeSeconds] = useState<number>(0);
    const token = getToken()

    useEffect(() => {
        if(!token) {
            navigate('/login')
        }
    }, [token]);

    useEffect(() => {
        dispatch(loadMyBookings());
        if (movies.length === 0) dispatch(loadMovies());
        fetchSettings().then(data => {
            setBookingPaymentTimeSeconds(data.bookingPaymentTimeSeconds);
        });
    }, [dispatch, movies.length]);

    useEffect(() => {
        if (cinemas.length === 0) {
            dispatch(loadCinemas());
        }
    }, [cinemas.length, dispatch]);

    // useEffect(() => {
    //     const movieIds = movies.map(m => m.id);
    //     const missingIds = movieIds.filter(id => !sessionsByMovie[id]);
    //
    //     missingIds.forEach(id => {
    //         dispatch(loadSessionsByMovieId(id));
    //     });
    // }, [movies, sessionsByMovie, dispatch]);
    //
    // useEffect(() => {
    //     const cinemaIds = cinemas.map(c => c.id);
    //     const missingIds = cinemaIds.filter(id => !sessionsByCinema[id]);
    //
    //     missingIds.forEach(id => {
    //         dispatch(loadSessionsByCinemaId(id));
    //     });
    // }, [cinemas, sessionsByCinema, dispatch]);

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
            <h4>Не оплаченные</h4>
            <hr className="divider"/>
            {unpaid.map(b => {
                const session = allSessions.find(s => s.id === b.movieSessionId);
                const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                const cinema = session ? cinemas.find(m => m.id === session.cinemaId) : undefined;
                return (
                    <BookingCard
                        key={b.id}
                        booking={b}
                        session={session as MovieSession}
                        movie={movie}
                        cinema={cinema}
                        bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                    />
                );
            })}
            <h4 style={{ marginTop: '30px' }}>Будущие</h4>
            <hr className="divider"/>
            {future.map(b => {
                const session = allSessions.find(s => s.id === b.movieSessionId);
                const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                const cinema = session ? cinemas.find(m => m.id === session.cinemaId) : undefined;
                return (
                    <BookingCard
                        key={b.id}
                        booking={b}
                        session={session as MovieSession}
                        movie={movie}
                        cinema={cinema}
                        bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                    />
                );
            })}
            <h4 style={{ marginTop: '30px' }}>Прошедшие</h4>
            <hr className="divider"/>
            {past.map(b => {
                const session = allSessions.find(s => s.id === b.movieSessionId);
                const movie = session ? movies.find(m => m.id === session.movieId) : undefined;
                const cinema = session ? cinemas.find(m => m.id === session.cinemaId) : undefined;
                return (
                    <BookingCard
                        key={b.id}
                        booking={b}
                        session={session as MovieSession}
                        movie={movie}
                        cinema={cinema}
                        bookingPaymentTimeSeconds={bookingPaymentTimeSeconds}
                    />
                );
            })}
        </div>
    );
};

export default MyTickets;
