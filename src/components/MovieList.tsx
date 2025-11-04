import React, { useEffect } from 'react';
import styles from '../css/MovieList.module.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMovies } from '../store/movieSessionsSlice';
import { BASE_URL } from "../api/config";

const MovieList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const movies = useAppSelector(state => state.movies.items);
    const loading = useAppSelector(state => state.movies.loading);

    useEffect(() => {
        if (movies.length === 0) dispatch(loadMovies());
    }, [dispatch, movies.length]);

    return (
        <div className={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Фильмы</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Название</th>
                        <th>Длительность</th>
                        <th>Рейтинг</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map(movie => (
                        <tr key={movie.id}>
                            <td>
                                <img
                                    src={`${BASE_URL}${movie.posterImage}`}
                                    alt={movie.title}
                                    className={styles.poster}
                                />
                            </td>
                            <td>{movie.title}</td>
                            <td>{movie.lengthMinutes} мин</td>
                            <td>{movie.rating.toFixed(1)}</td>
                            <td>
                                <button
                                    className={styles.sessionButton}
                                    onClick={() => navigate(`/movies/${movie.id}/sessions`)}
                                >
                                    Посмотреть сеансы
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MovieList;
