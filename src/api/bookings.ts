import { BASE_URL } from './config';
import { authFetch } from './auth';
import { Booking } from './types'

export type Seat = {
    rowNumber: number;
    seatNumber: number;
};

export async function bookSeats(sessionId: number, seats: Seat[]): Promise<void> {
    const res = await authFetch(`${BASE_URL}/movieSessions/${sessionId}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seats }),
    });
    if (!res.ok) throw new Error(`Ошибка бронирования: ${res.status}`);
}

export async function fetchMyBookings(): Promise<Booking[]> {
    const res = await authFetch(`${BASE_URL}/me/bookings`);
    if (!res.ok) throw new Error('Ошибка запроса к /me/bookings');
    return await res.json();
}