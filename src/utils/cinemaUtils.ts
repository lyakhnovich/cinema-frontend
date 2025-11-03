import { Session, Movie } from '../api/types';

export function groupSessionsByDate(sessions: Session[]): [string, Session[]][] {
    const map = new Map<string, Session[]>();

    sessions.forEach(session => {
        const date = new Date(session.startTime).toLocaleDateString();
        if (!map.has(date)) map.set(date, []);
        map.get(date)!.push(session);
    });

    return Array.from(map.entries());
}

export function getMovieById(movies: Movie[], id: number): Movie | undefined {
    return movies.find(m => m.id === id);
}

export function formatTime(time: string): string {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
