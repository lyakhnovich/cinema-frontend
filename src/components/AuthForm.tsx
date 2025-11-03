import React, { useState } from 'react';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../store/authSlice';
import styles from '../css/AuthForm.module.css';

type Mode = 'login' | 'register';

const AuthForm: React.FC = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validate = (): string | null => {
        if (username.length < 8) return 'Логин должен быть минимум 8 символов';
        if (!/[A-Z]/.test(password) || !/\d/.test(password) || password.length < 8)
            return 'Пароль должен быть минимум 8 символов, содержать заглавную букву и цифру';
        if (mode === 'register' && password !== confirm)
            return 'Пароли не совпадают';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) return setError(validationError);

        try {
            let token: string;
            if (mode === 'login') {
                token = await login(username, password);
            } else {
                token = await register({ username, password });
            }

            setToken(token);
            navigate('/tickets');
        } catch (err: any) {
            setError(err.message || 'Ошибка авторизации');
        }
    };

    return (
        <div className={styles.container}>
            <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
                {mode === 'register' && (
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        className={styles.input}
                    />
                )}
                <button type="submit" className={styles.button}>
                    {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.switchText}>
                {mode === 'login'
                    ? 'Если у вас нет аккаунта — '
                    : 'Если вы уже зарегистрированы — '}
                <button
                    type="button"
                    className={styles.switchButton}
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                    {mode === 'login' ? 'зарегистрируйтесь' : 'войдите'}
                </button>
            </p>
        </div>
    );
};

export default AuthForm;
