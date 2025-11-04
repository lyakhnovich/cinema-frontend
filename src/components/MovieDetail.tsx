import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/MovieDetail.module.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMovies, loadSessionsByMovieId } from '../store/movieSessionsSlice';
import { loadCinemas } from '../store/cinemasSlice';
import { selectActualSessionsByMovie } from '../store/selectors';
import { BASE_URL } from '../api/config';
import { groupSessionsByDate } from '../utils/cinemaUtils';

const MovieDetail: React.FC = () => {
    const { id } = useParams();
    const movieId = Number(id);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const loadingMovies = useAppSelector(state => state.movies.loading);
    const loadingSessions = useAppSelector(state => state.movieSessions.loading);
    const cinemas = useAppSelector(state => state.cinemas.items);
    const movie = useAppSelector(state =>
        state.movies.items.find(m => m.id === movieId)
    );
    const actualSessions = useAppSelector(selectActualSessionsByMovie(movieId));
    const grouped = groupSessionsByDate(actualSessions);

    useEffect(() => {
        if (!movie) dispatch(loadMovies());
        if (actualSessions.length === 0) dispatch(loadSessionsByMovieId(movieId));
        if (cinemas.length === 0) dispatch(loadCinemas());
    }, [movieId, movie, actualSessions.length, cinemas.length]);

    const getCinema = (cinemaId: number) =>
        cinemas.find(c => c.id === cinemaId);

    if (loadingMovies || loadingSessions) {
        return <p style={{ padding: '20px' }}>Загрузка...</p>;
    }

    if (!movie) {
        return <p style={{ padding: '20px' }}>Фильм не найден</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>{movie.title}</h2>
            <div className={styles.row}>
                <img
                    src={`${BASE_URL}${movie.posterImage}`}
                    alt={movie.title}
                    className={styles.poster}
                />
                <div className={styles.info}>
                    <p>{movie.description}</p>
                    <p><strong>Год:</strong> {movie.year}</p>
                    <p><strong>Длительность:</strong> {movie.lengthMinutes} мин</p>
                    <p><strong>Рейтинг:</strong> {movie.rating.toFixed(1)}</p>
                </div>
            </div>
            {grouped.map(([date, daySessions]) => (
                <div key={date} style={{ marginTop: '30px' }}>
                    <h3 className={styles.dateHeading}>{date}</h3>
                    <hr className="divider"/>

                    {Array.from(new Set(daySessions.map(s => s.cinemaId))).map(cinemaId => {
                        const cinema = getCinema(cinemaId);
                        const sessionsForCinema = daySessions.filter(s => s.cinemaId === cinemaId);

                        return (
                            <div
                                key={cinemaId}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '6px 12px',
                                }}
                            >
                                <strong>{cinema?.name ?? `Кинотеатр #${cinemaId}`}</strong>

                                <div style={{ whiteSpace: 'nowrap', marginLeft: '20px' }}>
                                    {sessionsForCinema.map(session => (
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

            <button
                className='back-button'
                onClick={() => navigate('/movies')}
            >
                ← Назад к списку
            </button>
        </div>
    );
};

export default MovieDetail;
