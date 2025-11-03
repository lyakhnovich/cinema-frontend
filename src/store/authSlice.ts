import { useState, useEffect } from 'react';

const TOKEN_KEY = 'auth_token';

let token: string | null = localStorage.getItem(TOKEN_KEY);
let listeners: (() => void)[] = [];

export function setToken(newToken: string) {
    token = newToken;
    localStorage.setItem(TOKEN_KEY, newToken);
    listeners.forEach(fn => fn());
}

export function getToken(): string | null {
    return token;
}

export function clearToken() {
    token = null;
    localStorage.removeItem(TOKEN_KEY);
    listeners.forEach(fn => fn());
}

export function useAuth(): boolean {
    const [isLoggedIn, setLoggedIn] = useState(!!getToken());

    useEffect(() => {
        const update = () => setLoggedIn(!!getToken());
        listeners.push(update);
        return () => {
            listeners = listeners.filter(fn => fn !== update);
        };
    }, []);

    return isLoggedIn;
}

