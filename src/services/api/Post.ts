import axios, { AxiosResponse } from 'axios';
import { Zukses } from './ResourceURL';

type URLType = 'zukses';

const urlMap: Record<URLType, string> = {
    zukses: Zukses
};

const Post = <T = unknown>(
    url: URLType,
    path: string,
    data: unknown,
    token?: string
): Promise<AxiosResponse<T>> => {
    const baseUrl = urlMap[url];
    const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` }
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
                }
                reject(err);
            });
    });
};

export default Post;
