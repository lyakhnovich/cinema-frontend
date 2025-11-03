import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import {Session} from '../api/types'

const EMPTY_SESSIONS: Session[] = [];

export const selectActualSessionsByCinema = (cinemaId: number) =>
    createSelector(
        (state: RootState) => state.cinemaSessions.byCinemaId[cinemaId] ?? EMPTY_SESSIONS,
        sessions => {
            const now = new Date();
            return sessions.filter(s => new Date(s.startTime) >= now);
        }
    );


export const selectActualSessionsByMovie = (movieId: number) =>
    createSelector(
        (state: RootState) => state.movieSessions.byMovieId[movieId] ?? EMPTY_SESSIONS,
        sessions => {
            const now = new Date();
            return sessions.filter(s => new Date(s.startTime) >= now);
        }
    );

