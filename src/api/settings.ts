import {BASE_URL} from "./config";

export interface SettingsResponse {
    bookingPaymentTimeSeconds: number;
}

export const fetchSettings = async (): Promise<SettingsResponse> => {
    const res = await fetch(`${BASE_URL}/settings`);
    return res.json();
};