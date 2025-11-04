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

    /*
    [
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "userId": 0,
    "movieSessionId": 0,
    "sessionId": 0,
    "bookedAt": "2025-11-04",
    "seats": [
      {
        "rowNumber": 0,
        "seatNumber": 0
      }
    ],
    "isPaid": true
  }
]
    */
}