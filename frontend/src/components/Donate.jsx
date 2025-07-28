import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
    const [charities, setCharities] = useState([]);
    const [charityId, setCharityId] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('one-time');
    const [anonymous, setAnonymous] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/charities`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                console.log('Charities response:', response.data);
                setCharities(response.data.filter(c => c.status === 'Active'));
            } catch (error) {
                console.error('Error fetching charities:', error);
                let errorMessage = 'Failed to load charities. Please try again later.';
                if (error.response) {
                    errorMessage = error.response.data?.error || `Error: ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = 'Network error. Check your connection or API URL.';
                }
                setMessage({
                    text: errorMessage,
                    type: 'error'
                });
            }
        };
        fetchCharities();
    }, []);

    const handleDonate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (!charityId) {
            setMessage({ text: 'Please select a charity', type: 'error' });
            setIsLoading(false);
            return;
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setMessage({ text: 'Please enter a valid amount', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/donate`,
                {
                    charity_id: parseInt(charityId),
                    amount: parseFloat(amount),
                    frequency,
                    anonymous
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setMessage({
                text: 'Donation successful! Thank you for your generosity.',
                type: 'success'
            });

            setAmount('');
            setCharityId('');
            setFrequency('one-time');
            setAnonymous(false);
            navigate('/donor-dashboard?refresh=true'); // Redirect with refresh param

        } catch (error) {
            console.error('Donation error:', error);
            let errorMessage = 'Donation failed. Please try again.';
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                errorMessage = error.response.data?.error || errorMessage;
            } else if (error.request) {
                errorMessage = 'Network error. Check your connection or API URL.';
            }

            setMessage({
                text: errorMessage,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Make a Donation</h2>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleDonate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Charity
                    </label>
                    <select
                        value={charityId}
                        onChange={(e) => setCharityId(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">-- Choose a charity --</option>
                        {charities.length > 0 ? (
                            charities.map((charity) => (
                                <option key={charity.id} value={charity.id}>
                                    {charity.name} - {charity.mission.substring(0, 50)}...
                                </option>
                            ))
                        ) : (
                            <option disabled>No charities available</option>
                        )}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (KSH)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                    </label>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="one-time">One-time donation</option>
                        <option value="monthly">Monthly recurring</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                        Donate anonymously
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                    {isLoading ? 'Processing...' : 'Donate Now'}
                </button>
            </form>
        </div>
    );
};

export default Donate;