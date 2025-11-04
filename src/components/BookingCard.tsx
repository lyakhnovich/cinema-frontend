import React, { useEffect, useState } from 'react';
import {Booking, Cinema, Movie, MovieSession} from '../api/types';
import {payForBooking} from "../api/payments";
import styles from '../css/Booking.module.css';

type Props = {
    booking: Booking;
    session?: MovieSession;
    movie?: Movie;
    cinema?: Cinema;
    bookingPaymentTimeSeconds: number;
};

const BookingCard: React.FC<Props> = ({ booking, session, movie, cinema, bookingPaymentTimeSeconds }) => {
    const [countdown, setCountdown] = useState<number>(0);
    const [isPaying, setIsPaying] = useState(false);

    const handlePayment = async () => {
        try {
            setIsPaying(true);
            await payForBooking(booking.id);
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

        countdown > 0 ?
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '6px 12px',
        }}>
        <div
            style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                marginBottom: '16px',
                padding: '6px 12px',
            }}
        >
            <div style={{minWidth: '280px'}}>
                <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>
                    {movie?.title ?? `Фильм #${booking.movieSessionId}`}
                </div>
                <div style={{marginTop: '2px'}}>
                    {cinema?.name ?? 'Кинотеатр неизвестен'}
                </div>
                <div style={{marginTop: '2px'}}>{formattedDate}</div>

            </div>
            <div style={{minWidth: '120px'}}>
                {booking.seats.map((s, index) => (
                    <div key={index}>
                        ряд {s.rowNumber}, место {s.seatNumber}
                    </div>
                ))}
            </div>
        </div>
        {!booking.isPaid && (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '6px 12px',
                }}>
                <button
                    disabled={isPaying || countdown <= 0}
                    onClick={handlePayment}
                    className={`${styles.payButton} ${
                        isPaying || countdown <= 0 ? styles.payDisabled : styles.payActive
                    }`}
                >
                    {isPaying ? 'Оплата...' : 'Оплатить'}
                </button>
                <div style={{
                    minWidth: '150px',
                    margin: '12px',
                    fontSize: '0.85rem',
                    color: countdown > 0 ? '#8a8a8a' : 'red'
                }}>
                    {countdown > 0
                        ? `Осталось ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`
                        : 'Время оплаты истекло'}
                </div>
            </div>
        )}
    </div> : <div/>
    );
};

export default BookingCard;
