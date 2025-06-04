import axios, { AxiosResponse, AxiosError } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

interface ErrorResponseData {
    message: string;
}

const Get = async <T = unknown>(url: URLType, path: string, token?: string): Promise<T | null> => {
    const baseUrl = urlMap[url];
    const bearerToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const config = bearerToken
        ? {
            headers: { Authorization: `Bearer ${bearerToken}` }
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
        }

        console.warn('GET failed:', axiosError.response?.status, axiosError.message);
        return null;
    }
};

export default Get;
