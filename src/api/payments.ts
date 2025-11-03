import { BASE_URL } from "./config";

export const payForBooking = async (bookingId: string): Promise<void> => {
    await fetch(`${BASE_URL}/bookings/${bookingId}/payments`);
};
