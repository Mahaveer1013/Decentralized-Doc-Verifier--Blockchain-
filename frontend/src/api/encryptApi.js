import axios from 'axios';
import CryptoJS from 'crypto-js';
import { backendUrl, secretKey } from '../constants';

const encryptApi = axios.create({
    baseURL: `${backendUrl}`,
});

const encryptValue = (value) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
    } catch (error) {
        console.error('Error during value encryption:', error);
        throw error;
    }
};

const decryptValue = (encryptedValue) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error('Decryption failed or result is empty');
        }
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error('Error during decryption:', error);
        throw error;
    }
};

// Request interceptor to encrypt data
encryptApi.interceptors.request.use((config) => {
    if (config.data) {
        config.data = encryptValue(config.data);
        config.headers['Content-Type'] = 'application/octet-stream';
    }
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to decrypt data
encryptApi.interceptors.response.use((response) => {
    if (response.data) {
        response.data = decryptValue(response.data);
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default encryptApi;