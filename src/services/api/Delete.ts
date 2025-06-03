import axios, { AxiosResponse } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

const Delete = <T = unknown>(
    url: URLType,
    path: string,
    token?: string
): Promise<AxiosResponse<T>> => {
    const baseUrl = urlMap[url];
    const bearer = token || localStorage.getItem('token');
    const config = token || localStorage.getItem('token')
        ? {
            headers: { Authorization: `Bearer ${bearer}` }
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
                }
                reject(err);
            });
    });
};

export default Delete;
