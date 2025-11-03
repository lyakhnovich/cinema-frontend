import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import MyTickets from './pages/MyTickets';
import AuthForm from "./components/AuthForm";
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import CinemaList from './components/CinemaList';
import CinemaDetail from './components/CinemaDetail';
import Booking from "./components/Booking";

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/booking/:sessionId" element={<Booking />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/cinemas" element={<CinemaList />} />
                <Route path="tickets" element={<MyTickets />} />
                <Route path="/movies/:id/sessions" element={<MovieDetail />} />
                <Route path="/cinemas/:id/sessions" element={<CinemaDetail />} />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/register" element={<AuthForm />} />
                <Route index element={<AuthForm />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
