import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ filteredAccount, accountEntries, className }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.chartInstance?.destroy();
      }
    };
  }, []);

  if (!filteredAccount || !accountEntries) {
    return <p className="text-white text-xl font-bold italic text-center">No account data available</p>;
  }

  // Calculate cumulative balance and PnL
  let cumulativeBalance = parseFloat(filteredAccount.initial_balance);
  const balances = [cumulativeBalance];
  const pnls = [];

  accountEntries.forEach(entry => {
    const pnl = parseFloat(entry.pnl);
    cumulativeBalance += pnl;
    balances.push(cumulativeBalance);
    pnls.push(pnl);
  });

  // Prepare the data for the chart
  const data = {
    labels: balances.map((_, index) => `Entry ${index + 1}`), // Label each point as "Entry 1", "Entry 2", etc.
    datasets: [
      {
        label: 'Account Balance',
        data: balances,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'PnL',
        data: pnls,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Balance and PnL',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Entries', // Label for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Balance / PnL', // Label for the y-axis (Account balance and PnL)
        },
        ticks: {
          callback: function (value) {
            return '$' + value.toFixed(2); // Format y-axis values as currency
          },
        },
      },
    },
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mt-6 lg:mt-0 ${className} h-auto`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        Performance Chart
      </h2>
      <div className="w-full">
        <Line data={data} options={options} ref={chartRef} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-black font-semibold">Current Balance: ${parseFloat(filteredAccount.account_balance).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PerformanceChart;
