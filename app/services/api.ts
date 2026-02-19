import axios from 'axios';
import { getToken } from './token';
const api = axios.create({
    baseURL: 'https://backend.dropnotas.com',
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(async function (request) {
    console.log('REQUEST URL:', request.url);
    const token = await getToken();
    console.log('Token:', token);
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});
export default api;
