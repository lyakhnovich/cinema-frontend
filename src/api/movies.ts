import { Movie, MovieSession, Session } from "./types";
import { BASE_URL } from "./config";
import {authFetch} from "./auth";

export async function fetchMovies(): Promise<Movie[]> {
    const res = await fetch(`${BASE_URL}/movies`);
    if (!res.ok) throw new Error('Ошибка запроса к /movies');
    return res.json();
}

// booking
export async function fetchSessionsByMovieId(id: number): Promise<Session[]> {
    const res = await fetch(`${BASE_URL}/movies/${id}/sessions`);
    if (!res.ok) throw new Error(`Ошибка запроса к /movies/${id}/sessions`);
    return await res.json();
}

export async function fetchMovieSessionById(id: number): Promise<MovieSession> {
    const res = await authFetch(`${BASE_URL}/movieSessions/${id}`);
    if (!res.ok) throw new Error(`Ошибка запроса к /movieSessions/${id}`);
    return await res.json();
}