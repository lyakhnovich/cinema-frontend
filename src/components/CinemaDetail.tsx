import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadSessionsByCinemaId } from '../store/cinemaSessionsSlice';
import { loadMovies } from '../store/moviesSlice';
import { getMovieById, formatTime, groupSessionsByDate } from '../utils/cinemaUtils';
import { BASE_URL } from '../api/config';
import { selectActualSessionsByCinema } from '../store/selectors';
import {loadCinemas} from "../store/cinemasSlice";
import styles from "../css/MovieDetail.module.css";

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
                    <h3 className={styles.dateHeading}>{date}</h3>
                    <hr className="divider"/>

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
                                            width: '60px',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            marginRight: '10px',
                                            borderRadius: '4px',
                                            boxShadow: 'rgba(0, 0, 0, 0.7) 0 15px 25px -10px, rgba(0, 0, 0, 0.5) 0 9px 8px -10px'
                                        }}
                                    />
                                    <strong>{movie?.title ?? `Фильм #${movieId}`}</strong>
                                </div>

                                <div style={{ whiteSpace: 'nowrap', marginLeft: '20px' }}>
                                    {sessionsForMovie.map(session => (
                                        <button
                                            key={session.id}
                                            onClick={() => navigate(`/booking/${session.id}`)}
                                            className='session-button'
                                        >
                                            {new Date(session.startTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
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
