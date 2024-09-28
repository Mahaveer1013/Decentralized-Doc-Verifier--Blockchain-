import React, { useState } from 'react';

const Institution = () => {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('document', file);

        try {
            const response = await fetch('/send-document', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Document sent successfully!');
            } else {
                alert('Error sending document');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    />
                </label>
                <label className="block mb-2">
                    Document:
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Institution;
