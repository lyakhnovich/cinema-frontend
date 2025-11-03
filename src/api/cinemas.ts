import {Cinema, Session} from './types'
import { BASE_URL } from "./config";

export async function fetchCinemas(): Promise<Cinema[]> {
    const res = await fetch(`${BASE_URL}/cinemas`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Ошибка запроса к /cinemas');
    return res.json();
}


export async function fetchSessionsByCinemaId(id: number): Promise<Session[]> {
    const res = await fetch(`${BASE_URL}/cinemas/${id}/sessions`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Ошибка запроса к /cinemas/${id}/sessions`);
    return await res.json();
}
