import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMyBookings } from '../store/bookingSlice';
import { loadMovies } from '../store/moviesSlice';
import { loadSessionsByMovieId } from '../store/movieSessionsSlice';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../api/types';

const MyTickets: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const bookings = useAppSelector(state => state.bookings.items);
    const movies = useAppSelector(state => state.movies.items);
    const sessionsByMovie = useAppSelector(state => state.movieSessions.byMovieId);
    const sessionsByCinema = useAppSelector(state => state.cinemaSessions.byCinemaId);
    const loading = useAppSelector(state => state.bookings.loading);

    useEffect(() => {
        dispatch(loadMyBookings());
        if (movies.length === 0) dispatch(loadMovies());
    }, [dispatch, movies.length]);

    const allSessions = useMemo(() => {
        return [
            ...Object.values(sessionsByMovie).flat(),
            ...Object.values(sessionsByCinema).flat(),
        ];
    }, [sessionsByMovie, sessionsByCinema]);

    useEffect(() => {
        const movieIds = movies.map(m => m.id);
        movieIds.forEach(id => {
            if (!sessionsByMovie[id]) {
                dispatch(loadSessionsByMovieId(id));
            }
        });
    }, [movies, sessionsByMovie, dispatch]);


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

    const findMovieTitle = (booking: Booking): string => {
        const session = allSessions.find(s => s.id === booking.movieSessionId);
        if (!session) return `Сеанс #${booking.movieSessionId}`;
        const movie = movies.find(m => m.id === session.movieId);
        return movie?.title ?? `Фильм #${session.movieId}`;
    };

    const renderBooking = (b: Booking) => {
        const session = allSessions.find(s => s.id === b.movieSessionId);
        const movie = session ? movies.find(m => m.id === session.movieId) : undefined;

        const formattedDate = session
            ? new Date(session.startTime).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            : 'Дата неизвестна';

        const seatInfo = b.seats
            .map(s => `ряд ${s.rowNumber}, место ${s.seatNumber}`)
            .join(', ');

        return (
            <div
                key={b.id}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px',
                }}
            >
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {movie?.title ?? `Фильм #${b.movieSessionId}`}
                    </div>
                    <div style={{ color: '#555', marginTop: '2px' }}>
                        {session?.cinemaId ? `Кинотеатр #${session.cinemaId}` : 'Кинотеатр неизвестен'}
                    </div>
                    <div style={{ color: '#777', marginTop: '2px' }}>{formattedDate}</div>
                </div>

                <div >
                    <div style={{ marginTop: '6px' }}>
                        {b.seats.map((s, index) => (
                            <div key={index} style={{ color: '#333' }}>
                                ряд {s.rowNumber}, место {s.seatNumber}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginLeft: '20px' }}>
                    {!b.isPaid && (
                        <button
                            style={{
                                padding: '6px 12px',
                                fontSize: '0.9rem',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                background: '#f5f5f5',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/tickets')}
                        >
                            Оплатить
                        </button>
                    )}
                </div>
            </div>
        );
    };


    if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Мои билеты</h2>

            <h3>Не оплаченные</h3>
            <hr />
            {unpaid.length === 0 ? <p>Нет неоплаченных билетов</p> : unpaid.map(renderBooking)}

            <h3 style={{ marginTop: '30px' }}>Будущие</h3>
            <hr />
            {future.length === 0 ? <p>Нет будущих билетов</p> : future.map(renderBooking)}

            <h3 style={{ marginTop: '30px' }}>Прошедшие</h3>
            <hr />
            {past.length === 0 ? <p>Нет прошедших билетов</p> : past.map(renderBooking)}
        </div>
    );
};

export default MyTickets;
