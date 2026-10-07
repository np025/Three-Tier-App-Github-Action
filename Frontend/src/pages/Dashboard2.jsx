import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export const Dashboard = () => {
  // State to store input amount, conversion result, loading, error, currencies, and selected currencies
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('INR'); // Default source currency
  const [toCurrency, setToCurrency] = useState('USD'); // Default target currency
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]); // List of all currencies

  // Fetch the list of currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/7953b889029a494b40be1f86/codes`);
        const data = await response.json();
        
        if (data.result === "success") {
          setCurrencies(data.supported_codes); // Set the list of supported currencies
        } else {
          setError('Failed to fetch currency list.');
        }
      } catch (error) {
        setError('Error fetching currency list.');
      }
    };

    fetchCurrencies();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 center">
      <h1 className="text-3xl mb-6">Currency Conversion</h1>

      {/* Input for the amount */}
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={handleInputChange}
          className="p-2 bg-gray-800 text-white border border-gray-700"
          placeholder="Enter amount"
        />
      </div>

      {/* Dropdown for source currency */}
      <div className="mb-4">
        <label className="block mb-2">From Currency:</label>
        <select
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
          className="p-2 bg-gray-800 text-white border border-gray-700"
        >
          {currencies.length === 0 ? (
            <option>Loading currencies...</option>
          ) : (
            currencies.map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyName} ({currencyCode})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Dropdown for target currency */}
      <div className="mb-4">
        <label className="block mb-2">To Currency:</label>
        <select
          value={toCurrency}
          onChange={handleToCurrencyChange}
          className="p-2 bg-gray-800 text-white border border-gray-700"
        >
          {currencies.length === 0 ? (
            <option>Loading currencies...</option>
          ) : (
            currencies.map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyName} ({currencyCode})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvertCurrency}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Convert
      </button>

      {/* Loading state */}
      {loading && <p className="mt-4 text-yellow-300">Converting...</p>}

      {/* Error state */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Display converted amount */}
      {convertedAmount !== null && !loading && !error && (
        <div className="mt-4">
          <h2 className="text-xl">Converted Amount</h2>
          <p className="text-2xl">{toCurrency}: {convertedAmount}</p>
        </div>
      )}
    </div>
  );
};
