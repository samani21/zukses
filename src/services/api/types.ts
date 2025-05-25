export interface UserData {
    name: string;
    email: string;
    id: number;
    role: string;
    whatsapp: string;
}

export interface RegisterResponse {
    token: string;
    data: UserData;
    expires_in?: number;
    token_type?: string;
    [key: string]: unknown;
}

export interface Response {
    data: UserData;
    [key: string]: unknown;
}