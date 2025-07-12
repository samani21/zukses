import axios, { AxiosResponse } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

// Fungsi untuk membersihkan token dari tanda kutip jika perlu
const getCleanToken = (token?: string): string | null => {
    const rawToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!rawToken) return null;

    try {
        return JSON.parse(rawToken); // Jika token disimpan sebagai JSON string
    } catch {
        return rawToken.replace(/^"|"$/g, ''); // Hilangkan tanda kutip jika ada
    }
};

const Delete = <T = unknown>(
    url: URLType,
    path: string,
    token?: string
): Promise<AxiosResponse<T>> => {
    const baseUrl = urlMap[url];
    const cleanToken = getCleanToken(token);

    const config = cleanToken
        ? {
            headers: { Authorization: `Bearer ${cleanToken}` }
        }
        : {};

    return new Promise((resolve, reject) => {
        axios
            .delete(`${baseUrl}/${path}`, config)
            .then((result: AxiosResponse<T>) => {
                resolve(result);
            })
            .catch((err) => {
                if (err?.response?.data?.message === 'token expired') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login'
                }
                reject(err);
            });
    });
};

export default Delete;
