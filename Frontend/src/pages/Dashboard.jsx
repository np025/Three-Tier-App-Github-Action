import React, { useState } from 'react';
import { currencyList } from '../components/currencyList'; // Import the currency list
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom

export const Dashboard = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // State to store input amount, conversion result, loading, error, and selected currencies
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('INR'); // Default source currency
  const [toCurrency, setToCurrency] = useState('USD'); // Default target currency
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => setAmount(e.target.value);
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value);
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value);

  // Handle the currency conversion
  const handleConvertCurrency = async () => {
    const token = localStorage.getItem('token');

    if (!amount || !token) {
      setError('Please enter an amount and ensure you are logged in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Make the API request
      const response = await fetch(
        `${API_URL}/currency/convert?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data. Please try again.');
      }

      // Parse the response
      const data = await response.json();
      setConvertedAmount(data); // Set the converted amount
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout and redirect to homepage
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to home route
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>

      <h1 className="text-3xl mb-6 text-center">Currency Conversion</h1>

      {/* Horizontal Layout for all elements */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
        {/* Amount Input */}
        <div className="flex-1 sm:w-1/5">
          <input
            type="number"
            value={amount}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            placeholder="Enter amount"
          />
        </div>

        {/* From Currency Dropdown */}
        <div className="flex-1 sm:w-1/5">
          <label className="block mb-2">From Currency:</label>
          <select
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
          >
            {Object.entries(currencyList).map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyName} ({currencyCode})
              </option>
            ))}
          </select>
        </div>

        {/* To Currency Dropdown */}
        <div className="flex-1 sm:w-1/5">
          <label className="block mb-2">To Currency:</label>
          <select
            value={toCurrency}
            onChange={handleToCurrencyChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
          >
            {Object.entries(currencyList).map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyName} ({currencyCode})
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <div className="flex-1 sm:w-1/5">
          <button
            onClick={handleConvertCurrency}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Convert
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && <p className="mt-4 text-yellow-300 text-center">Converting...</p>}

      {/* Error state */}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {/* Display converted amount */}
      {convertedAmount !== null && !loading && !error && (
        <div className="mt-4 text-center">
          <h2 className="text-xl">Converted Amount</h2>
          <p className="text-2xl">{toCurrency}: {convertedAmount}</p>
        </div>
      )}
    </div>
  );
};
