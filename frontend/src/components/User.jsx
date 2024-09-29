import React from 'react';

const User = () => {

    async function getData() {
        const data = await api.post('/get-my-documents')
        console.log(data.data);
    }
    getData()
    const requests = [
        { id: 1, name: 'Request from Institution A' },
        { id: 2, name: 'Request from Institution B' },
        // Add more requests as needed
    ];

    const handleAccept = (id) => {
        alert(`Accepted request ${id}`);
        // Add logic to handle acceptance of request
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Requests</h1>
            <div className="space-y-4">
                {requests.map((request) => (
                    <div key={request.id} className="p-4 border rounded shadow">
                        <h2 className="text-lg font-semibold">{request.name}</h2>
                        <button
                            onClick={() => handleAccept(request.id)}
                            className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Accept
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default User;
