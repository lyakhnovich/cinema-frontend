import { BASE_URL } from "./config";
import { getToken, clearToken } from '../store/authSlice';

export async function authFetch(
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> {
    const token = getToken();
    const headers = {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        console.warn('Неавторизован. Очищаем токен.');
        clearToken();
    }

    return response;
}

export async function login(username: string, password: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Неверный логин или пароль');
    const data = await res.json();
    return data.token;
}

export async function register(data: {
    username: string;
    password: string;
}): Promise<string> {
    const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка регистрации');
    }

    const result = await res.json();
    return result.token;
}