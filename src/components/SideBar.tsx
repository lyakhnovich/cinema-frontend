import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, clearToken } from '../store/authSlice';
import styles from '../css/Sidebar.module.css';
import logo from '../img/logo-nestflix.svg';

const Sidebar: React.FC = () => {
    const isLoggedIn = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate('/movies');
    };

    return (
        <aside className={styles.sidebar}>
            <img className={styles.logo} src={logo} alt="" />
            <nav className={styles.nav}>
                <Link to="/movies" className={styles.link}>Фильмы</Link>
                <Link to="/cinemas" className={styles.link}>Кинотеатры</Link>
                <Link to="/tickets" className={styles.link}>Мои билеты</Link>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.button}>Выход</button>
                ) : (
                    <Link to="/login" className={styles.link}>Вход</Link>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
