import React, { useState } from 'react';
import api from '../api/api';
import axios from 'axios';

function SendDocument() {
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !document) {
            alert('Please provide both email and document.');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('userPublicKey', 'USER_PUBLIC_KEY'); // Replace with actual user's public key
        formData.append('file', document);

        try {
            const response = await api.post('/send-document', formData, {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error sending document:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Send Document</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Recipient Email"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                <input
                    type="file"
                    id="document"
                    onChange={(e) => setDocument(e.target.files[0])}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Send Document
            </button>
        </form>

    );
}

export default SendDocument;
