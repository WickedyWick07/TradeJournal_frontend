import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AccountCreation = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [broker, setBroker] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const brokers = [
    'IG GROUP', 
    'OANDA',
    'XM',
    'ETORO',
    'SAXO BANK', 
    'PEPPERSTONE',
    'INTERACTIVE BROKERS', 
    'AVATRADE',
    'FP MARKETS'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'account-number') {
      setAccountNumber(value);
    } else if (name === 'account-balance') {
      setAccountBalance(value);
    } else if (name === 'broker') {
      setBroker(value);
    }
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post('api/create-account/', {
        account_number: accountNumber,
        account_balance: accountBalance,
        broker: broker,
      });
      console.log(response.data);
      if (response.status === 201) {
        setLoading(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating the account:', err);
      setError('Failed to create account. Please try again.'); // Update error state
      setLoading(false); // Ensure loading state is reset on error
    }
  };

  return (
    <div className='bg-primaryColor min-h-screen flex items-center justify-center '>
      <div className='shadow-lg m-4 p-4 '>
        <form className='flex flex-col justify-center items-center ' onSubmit={handleAccountCreation}>
          <h1 className='text-tertiaryColor text-xl m-2 font-semibold uppercase'>Create journal for account</h1>

          <label className='text-sm font-semibold text-white' htmlFor="account-number">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleChange}
            className='m-2 p-2 rounded text-center font-semibold'
            maxLength={8}
            name='account-number'
            required // Optional: add required attribute
          />

          <label className='text-sm font-semibold text-white' htmlFor="account-balance">Initial Account Balance</label>
          <input
            type="number"
            onChange={handleChange}
            value={accountBalance}
            className='m-2 p-2 rounded text-center font-semibold '
            name='account-balance'
            step='0.01'
            required // Optional: add required attribute
          />

          <label className='text-sm font-semibold text-white' htmlFor="broker">Broker</label>
          <select
            name='broker'
            onChange={handleChange}
            className='m-2 p-2 rounded text-center font-semibold'
            value={broker}
            required // Optional: add required attribute
          >
            <option value="">Select your broker</option>
            {brokers.map((broker, index) => (
              <option key={index} value={broker}>
                {broker}
              </option>
            ))}
          </select>

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

          {/* Display the loading spinner when `loading` is true */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiaryColor mx-auto"></div>
              <p className="mt-4 text-xl text-gray-600">Creating a new account...</p>
            </div>
          )}

          <button className='bg-tertiaryColor mx-4 p-2 rounded font-bold' type='submit'>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountCreation;
