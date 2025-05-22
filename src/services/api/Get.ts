import axios, { AxiosResponse } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

const Get = <T = any>(url: URLType, path: string, token?: string): Promise<T> => {
    const baseUrl = urlMap[url];
    const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` }
        }
        : {};

    return new Promise<T>((resolve, reject) => {
        axios
            .get(`${baseUrl}/${path}`, config)
            .then((result: AxiosResponse<T>) => {
                resolve(result.data);
            })
            .catch((err) => {
                if (err?.response?.data?.message === 'token expired') {
                    localStorage.removeItem('token');
                }
                reject(err);
            });
    });
};

export default Get;
