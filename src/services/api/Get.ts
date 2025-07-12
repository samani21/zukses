import axios, { AxiosResponse, AxiosError } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

interface ErrorResponseData {
    message: string;
}

// Fungsi untuk membersihkan token dari tanda kutip jika perlu
const getCleanToken = (token?: string): string | null => {
    const rawToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!rawToken) return null;

    try {
        return JSON.parse(rawToken); // Jika token berupa string JSON
    } catch {
        return rawToken.replace(/^"|"$/g, ''); // Jika bukan, hilangkan tanda kutip di awal/akhir jika ada
    }
};

const Get = async <T = unknown>(url: URLType, path: string, token?: string): Promise<T | null> => {
    const baseUrl = urlMap[url];
    const cleanToken = getCleanToken(token);

    const config = cleanToken
        ? {
            headers: { Authorization: `Bearer ${cleanToken}` }
        }
        : {};

    try {
        const result: AxiosResponse<T> = await axios.get(`${baseUrl}/${path}`, config);
        return result.data;
    } catch (err: unknown) {
        const axiosError = err as AxiosError<ErrorResponseData>;
        const message = axiosError.response?.data?.message;

        if (message === 'token expired') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login'
        }

        console.warn('GET failed:', axiosError.response?.status, axiosError.message);
        return null;
    }
};

export default Get;
