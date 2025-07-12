import axios, { AxiosResponse } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

// Fungsi untuk mendapatkan token dan membersihkan tanda kutip jika ada
const getCleanToken = (token?: string): string | null => {
    const rawToken = token || localStorage.getItem('token');
    if (!rawToken) return null;

    try {
        // Jika token berasal dari JSON.stringify, hapus tanda kutip
        return JSON.parse(rawToken);
    } catch {
        // Jika bukan stringified JSON, kembalikan apa adanya
        return rawToken.replace(/^"|"$/g, '');
    }
};

const Post = <T = unknown>(
    url: URLType,
    path: string,
    data: unknown,
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
            .post(`${baseUrl}/${path}`, data, config)
            .then((result: AxiosResponse<T>) => {
                resolve(result);
            })
            .catch((err) => {
                if (err?.response?.data?.message === 'token expired') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                reject(err);
            });
    });
};

export default Post;
