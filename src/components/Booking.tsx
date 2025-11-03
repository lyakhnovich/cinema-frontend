import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { fetchMovieSessionById } from '../api/movies';
import {bookSeats} from "../api/bookings";
import {MovieSession} from '../api/types';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {loadMovies} from "../store/moviesSlice";
import {loadCinemas} from "../store/cinemasSlice";

type Seat = { rowNumber: number; seatNumber: number };

const Booking: React.FC = () => {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const dispatch = useAppDispatch();
    const movies = useAppSelector(state => state.movies.items);
    const cinemas = useAppSelector(state => state.cinemas.items);
    const [session, setSession] = useState<MovieSession | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (movies.length === 0) dispatch(loadMovies());
        if (cinemas.length === 0) dispatch(loadCinemas());
    }, [dispatch, movies.length, cinemas.length]);

    useEffect(() => {
        if (!sessionId) return;
        fetchMovieSessionById(Number(sessionId))
            .then(setSession)
            .catch(err => {
                console.error(err);
                setError('Ошибка загрузки сеанса');
            });
    }, [sessionId]);

    const movie = useMemo(
        () => movies.find(m => m.id === session?.movieId),
        [movies, session?.movieId]
    );

    const cinema = useMemo(
        () => cinemas.find(c => c.id === session?.cinemaId),
        [cinemas, session?.cinemaId]
    );

    const formatDateTime = (iso: string) => {
        const d = new Date(iso);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
    };

    const isBooked = (row: number, seat: number) =>
        session?.bookedSeats.some(bs => bs.rowNumber === row && bs.seatNumber === seat);

    const isSelected = (row: number, seat: number) =>
        selectedSeats.some(s => s.rowNumber === row && s.seatNumber === seat);

    const toggleSeat = (row: number, seat: number) => {
        if (isBooked(row, seat)) return;
        const seatObj = { rowNumber: row, seatNumber: seat };
        setSelectedSeats(prev =>
            isSelected(row, seat)
                ? prev.filter(s => !(s.rowNumber === row && s.seatNumber === seat))
                : [...prev, seatObj]
        );
    };

    const handleBooking = async () => {
        if (!session) return;
        try {
            await bookSeats(session.id, selectedSeats);
            // alert('Бронирование успешно!');
            navigate('/tickets');
            setSelectedSeats([]);
        } catch (err) {
            console.error(err);
            alert('Ошибка при бронировании');
        }
    };

    if (error) return <div>{error}</div>;
    if (!session) return <div>Загрузка...</div>;

    const { seats } = session;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Выбрать места</h2>

            <p>
                Фильм: {movie?.title ?? `#${session.movieId}`} <br />
                Кинотеатр: {cinema?.name ?? `#${session.cinemaId}`} <br />
                Время: {formatDateTime(session.startTime)}
            </p>
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', marginBottom: '8px', marginLeft: '60px' }}>
                    {Array.from({ length: seats.seatsPerRow }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '32px',
                                height: '32px',
                                lineHeight: '30px',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                // background: '#bdc3c7',
                                borderRadius: '4px',
                                marginRight: '4px',
                            }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
                {Array.from({ length: seats.rows }, (_, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', marginBottom: '6px' }}>
                        <div
                            style={{
                                width: '60px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                fontSize: '0.9rem',
                            }}
                        >
                            Ряд {rowIdx + 1}
                        </div>
                        {Array.from({ length: seats.seatsPerRow }, (_, seatIdx) => {
                            const row = rowIdx + 1;
                            const seat = seatIdx + 1;
                            const booked = isBooked(row, seat);
                            const selected = isSelected(row, seat);

                            return (
                                <div
                                    key={seatIdx}
                                    onClick={() => toggleSeat(row, seat)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        marginRight: '4px',
                                        background: booked
                                            ? '#e74c3c'
                                            : selected
                                                ? '#2ecc71'
                                                : '#ecf0f1',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: booked ? 'not-allowed' : 'pointer',
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                }}
            >
                Забронировать {selectedSeats.length} мест
            </button>
        </div>
    );
};

export default Booking;
