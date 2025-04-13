
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthProvider';
import { API_URL_TS } from '../util';

const AxiosContext = createContext({});
const { Provider } = AxiosContext;

export function AxiosProvider({ children }) {
    const { LogOut } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;
    const publicFetchTs = axios.create({
        baseURL: API_URL_TS
    })
    const publicFetch = axios.create({
        baseURL: apiUrl,
    });
    const privateFetchTs = axios.create({
        baseURL: API_URL_TS
    })
    const privateFetch = axios.create({
        baseURL: apiUrl,
    })
    privateFetchTs.interceptors.request.use(
        async config => {
            const token = localStorage.getItem("token");
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });
    privateFetchTs.interceptors.response.use(
        response => {
            //if (response.data.text === "Unauthorized") LogOut();
            return response;
        },
        async error => {
            Promise.reject(error);
        }
    );
    privateFetch.interceptors.request.use(
        async config => {
            const token = localStorage.getItem("token");
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });
    privateFetch.interceptors.response.use(
        response => {
            //if (response.data.text === "Unauthorized") LogOut();
            return response;
        },
        async error => {
            Promise.reject(error);
        }
    );
    return (
        <Provider value={{
            publicFetch,
            publicFetchTs,
            privateFetch,
            privateFetchTs
        }}>
            {children}
        </Provider>
    );
}
export function useAxios() {
    return useContext(AxiosContext);
}
