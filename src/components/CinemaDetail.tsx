import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadSessionsByCinemaId } from '../store/cinemaSessionsSlice';
import { loadMovies } from '../store/moviesSlice';
import { getMovieById, formatTime, groupSessionsByDate } from '../utils/cinemaUtils';
import { BASE_URL } from '../api/config';
import { selectActualSessionsByCinema } from '../store/selectors';
import {loadCinemas} from "../store/cinemasSlice";

const CinemaDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const cinemaId = Number(id);
    const dispatch = useAppDispatch();

    const movies = useAppSelector(state => state.movies.items);
    const cinema = useAppSelector(state =>
        state.cinemas.items.find(c => c.id === cinemaId)
    );

    const actualSessions = useAppSelector(selectActualSessionsByCinema(cinemaId));
    const grouped = groupSessionsByDate(actualSessions);

    useEffect(() => {
        if (actualSessions.length === 0) dispatch(loadSessionsByCinemaId(cinemaId));
        if (movies.length === 0) dispatch(loadMovies());
        if (!cinema) dispatch(loadCinemas());
    }, [cinemaId, actualSessions.length, movies.length, cinema]);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>{cinema?.name ?? `Кинотеатр #${cinemaId}`}</h2>

            {grouped.map(([date, daySessions]) => (
                <div key={date} style={{ marginTop: '30px' }}>
                    <h3>{date}</h3>
                    <hr />

                    {Array.from(new Set(daySessions.map(s => s.movieId))).map(movieId => {
                        const movie = getMovieById(movies, movieId);
                        const sessionsForMovie = daySessions.filter(s => s.movieId === movieId);

                        return (
                            <div
                                key={movieId}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={`${BASE_URL}${movie?.posterImage}`}
                                        alt={movie?.title}
                                        style={{
                                            width: '80px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <strong>{movie?.title ?? `Фильм #${movieId}`}</strong>
                                </div>

                                <div style={{ whiteSpace: 'nowrap', marginLeft: '20px' }}>
                                    {sessionsForMovie.map(session => (
                                        <button
                                            key={session.id}
                                            onClick={() => navigate(`/booking/${session.id}`)}
                                            style={{
                                                marginLeft: '8px',
                                                padding: '4px 8px',
                                                fontSize: '0.9rem',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                background: '#f5f5f5',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {formatTime(session.startTime)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default CinemaDetail;
