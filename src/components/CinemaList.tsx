import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadCinemas } from '../store/cinemasSlice';
import styles from '../css/CinemaList.module.css';
import {useNavigate} from "react-router-dom";

const CinemaList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cinemas = useAppSelector(state => state.cinemas.items);
    const loading = useAppSelector(state => state.cinemas.loading);

    useEffect(() => {
        if (cinemas.length === 0) {
            dispatch(loadCinemas());
        }
    }, [cinemas.length, dispatch]);

    if (loading) return <p>Загрузка кинотеатров...</p>;

    return (
        <div className={styles.container}>
            <h2 style={{ textAlign: 'center' }}>Кинотеатры</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Кинотеатр</th>
                        <th>Адрес</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cinemas.map(cinema => (
                        <tr key={cinema.id}>
                            <td>{cinema.name}</td>
                            <td>{cinema.address}</td>
                            <td>
                                <button
                                    className={styles.sessionButton}
                                    onClick={() => navigate(`/cinemas/${cinema.id}/sessions`)}
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

export default CinemaList;
