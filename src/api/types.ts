export interface MovieSession {
    id: number;
    movieId: number;
    cinemaId: number;
    startTime: string;
    seats: {
        rows: number;
        seatsPerRow: number;
    };
    bookedSeats: {
        rowNumber: number;
        seatNumber: number;
    }[];
}

export interface Movie {
    id: number;
    title: string;
    description: string;
    year: number;
    lengthMinutes: number;
    rating: number;
    posterImage: string;
    sessions?: Session[];
}

export interface Session {
    id: number;
    movieId: number;
    cinemaId: number;
    startTime: string;
}

export interface Cinema {
    id: number;
    name: string;
    address: string;
    sessions?: Session[];
}

export interface Booking {
    id: string;
    userId: number;
    movieSessionId: number;
    sessionId: number;
    bookedAt: string;
    seats: {
        rowNumber: number;
        seatNumber: number;
    }[];
    isPaid: boolean;
}
