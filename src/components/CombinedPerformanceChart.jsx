import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api'; // Assuming api is defined for making requests

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CombinedPerformanceChart = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]); // To store account info

  useEffect(() => {
    fetchJournalEntries();
    fetchAccounts();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const response = await api.get('api/fetch-all-journal-entries/');
      const sortedEntries = response.data.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
      setEntries(sortedEntries);
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('There was an error fetching the entries:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await api.get('api/fetch-accounts/');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts', error);
      setError('Error fetching accounts');
    }
  };

  // Extract sorted dates and P&L data from entries
  const labels = entries.map(entry => entry.date);
  const pnlData = entries.map(entry => entry.pnl);

  // Check if account data is available
  const account = accounts[0]; // Assuming you're dealing with a single account

  if (account) {
    const initialBalanceDate = account.created_at;
    const initialBalance = account.initial_balance;

    // Prepend the initial balance at the account creation date
    labels.unshift(initialBalanceDate); // Add the account creation date to the start of labels
        // Add the initial balance to the start of pnlData
  }

  // Define the data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Profit & Loss',
        data: pnlData,
        borderColor: '#4A90E2', // Custom blue line color
        backgroundColor: 'rgba(74, 144, 226, 0.1)', // Light blue fill
        pointBackgroundColor: '#4A90E2', // Point color
        pointBorderColor: '#fff', // White border around points
        pointHoverBackgroundColor: '#fff', // White background on hover
        pointHoverBorderColor: '#4A90E2', // Border color on hover
        borderWidth: 3, // Thicker line
        tension: 0.3, // Slight curve on the line
        fill: true, // Fill the area under the line
      },
    ],
  };

  // Define chart options with custom styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333', // Legend text color
          font: {
            size: 14, // Font size for legend
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Trading Performance (P&L)',
        color: '#333', // Title text color
        font: {
          size: 18, // Font size for title
          weight: 'bold', // Bold title text
        },
        padding: 20, // Add some padding to the title
      },
      tooltip: {
        backgroundColor: '#4A90E2', // Darker background for tooltips
        titleColor: '#fff', // White title text in tooltip
        bodyColor: '#fff', // White text in tooltip body
        cornerRadius: 6, // Rounded corners for tooltips
        padding: 10, // Padding inside the tooltip
      },
    },
    scales: {
      x: {
        display: false, // Hide the x-axis entirely
      },
      y: {
        title: {
          display: true,
          text: 'Profit/Loss',
          color: '#333', // Y-axis title color
          font: {
            size: 14, // Y-axis title font size
          },
        },
        ticks: {
          color: '#666', // Y-axis label color
          font: {
            size: 12, // Y-axis label font size
          },
          callback: (value) => `$${value}`, // Format Y-axis values as currency
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Light gray horizontal gridlines
          borderDash: [5, 5], // Dashed gridlines
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading performance data...</p>
        ) : error ? (
          <p className="text-red-500 text-center">There was an error loading data.</p>
        ) : entries.length > 0 ? (
          <div className="h-96">
            <Line data={data} options={options} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default CombinedPerformanceChart;
