import React, { useEffect, useState } from 'react';
import {Booking, Cinema, Movie, MovieSession} from '../api/types';
import { useNavigate } from 'react-router-dom';
import {payForBooking} from "../api/payments";

type Props = {
    booking: Booking;
    session?: MovieSession;
    movie?: Movie;
    cinema?: Cinema;
    bookingPaymentTimeSeconds: number;
};

const BookingCard: React.FC<Props> = ({ booking, session, movie, cinema, bookingPaymentTimeSeconds }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [paid, setPaid] = useState(booking.isPaid);

    const handlePayment = async () => {
        try {
            setIsPaying(true);
            console.log(booking)
            await payForBooking(booking.id);
            setPaid(true); // локально обновляем
        } catch (error) {
            console.error('Ошибка оплаты:', error);
            alert('Не удалось оплатить бронирование');
        } finally {
            setIsPaying(false);
        }
    };

    useEffect(() => {
        if (!booking.isPaid && bookingPaymentTimeSeconds > 0) {
            const bookedAt = new Date(booking.bookedAt).getTime();
            const deadline = bookedAt + bookingPaymentTimeSeconds * 1000;

            const update = () => {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
                setCountdown(remaining);
            };

            update();
            const interval = setInterval(update, 1000);
            return () => clearInterval(interval);
        }
    }, [booking.bookedAt, booking.isPaid, bookingPaymentTimeSeconds]);

    const formattedDate = session
        ? new Date(session.startTime).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Дата неизвестна';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                padding: '12px',
            }}
        >
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {movie?.title ?? `Фильм #${booking.movieSessionId}`}
                </div>
                <div style={{ color: '#555', marginTop: '2px' }}>
                    {cinema?.name ?? 'Кинотеатр неизвестен'}
                </div>
                <div style={{ color: '#777', marginTop: '2px' }}>{formattedDate}</div>

            </div>
            <div>
                {booking.seats.map((s, index) => (
                    <div key={index} style={{ color: '#333' }}>
                        Ряд {s.rowNumber}, место {s.seatNumber}
                    </div>
                ))}
            </div>
            {!paid && (
                <>
                    <button
                        disabled={isPaying}
                        onClick={handlePayment}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.9rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: isPaying ? '#ddd' : '#f5f5f5',
                            cursor: isPaying ? 'default' : 'pointer',
                        }}
                    >
                        {isPaying ? 'Оплата...' : 'Оплатить'}
                    </button>
                    {countdown !== null && (
                        <div style={{ marginTop: '6px', fontSize: '0.85rem', color: countdown > 0 ? '#444' : 'red' }}>
                            {countdown > 0
                                ? `Осталось ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`
                                : 'Время оплаты истекло'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BookingCard;
