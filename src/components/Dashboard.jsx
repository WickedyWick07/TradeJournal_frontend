import React, { useEffect, useState, useRef } from 'react';
import Calendar from 'tui-calendar';
import { Chart, registerables } from 'chart.js';
import 'tui-calendar/dist/tui-calendar.css';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import api from '../services/api';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import CombinedPerformanceChart from './CombinedPerformanceChart';
import PerformanceChart from './PerformanceChart';



// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]); // All fetched entries
   
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const calendarRef = useRef(null); // Create a ref for the calendar instance
  const chartRef = useRef(null); // Create a ref for the chart instance
  const [accounts, setAccounts] = useState([])

   

  const handleGoToJournalEntry = () => {
    navigate('/journal-entry');
  };

  const getFullImageUrl = (imagePath) => {
    if(!imagePath) return null;
    if (imagePath.startsWith('media')) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`

  }

  const fetchAccounts = async () => {
    try {
      const response = await api.get('api/fetch-accounts/');
      console.log('account:', response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts', error);
      setError('Error fetching accounts');
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await api.get('api/fetch-all-journal-entries/');
      console.log(response.data)
      const sortedEntries = response.data.sort((a,b) => new Date(b.date) - new Date(a.date));
      setEntries(sortedEntries);
      return response.data; // Return the entries for further processing
    } catch (error) {
      console.log('There was an error fetching the entries', error);
    }
  };

  useEffect(() => {
    // Initialize the calendar after the component mounts
    calendarRef.current = new Calendar('#calendar', {
      defaultView: 'month',
      useCreationPopup: false,
      useDetailPopup: true,
      isReadOnly: true,
      month: {
        daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        startDayOfWeek: 0,
      },
    });

    const createPieChart = (data) => {
      // Destroy previous chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      // Only create the chart if there’s data
      if (data && data.length > 0) {
        chartRef.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Wins', 'Losses', 'Break-Even'],
            datasets: [{
              label: 'Results',
              data: data,
              backgroundColor: [
                'rgba(0, 255, 0, 0.8)',   // Green with 0.2 opacity
                'rgba(255, 0, 0, 0.8)',   // Red with 0.2 opacity
                'rgba(255, 255, 0, 0.8)', // Yellow with 0.2 opacity
              ],
              borderColor: [
                'rgba(0, 255, 0, 1)',     // Solid Green
                'rgba(255, 0, 0, 1)',     // Solid Red
                'rgba(255, 255, 0, 1)',   // Solid Yellow
              ],
              borderWidth: 1,
              
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.label || '';
                    if (context.parsed !== null) {
                      label += ': ' + context.parsed;
                    }
                    return label;
                  }
                }
              }
            }
          },
        });
      } else {
        console.log('No data available for chart rendering.');
      }
    };

    const fetchChartData = async () => {
      try {
        const entriesData = await fetchJournalEntries(); // Fetch entries
        console.log(entriesData.data)
        const wins = entriesData.filter(entry => entry.result === 'win').length;
        const losses = entriesData.filter(entry => entry.result === 'loss').length;
        const breakeven = entriesData.filter(entry => entry.result === 'break-even').length;

        const data = [wins, losses, breakeven];
        createPieChart(data);
        updateCalendarEvents(entriesData); // Update calendar events here
      } catch (error) {
        console.error('Failed to fetch chart data or create chart:', error);
      }
    };

    fetchChartData();
    fetchAccounts()

    // Cleanup function to remove the calendar and chart instances when the component unmounts
    return () => {
      if (calendarRef.current) {
        calendarRef.current.destroy();
      }
      if (chartRef.current) {
        chartRef.current.destroy(); // Use the ref to destroy the chart
      }
    };
  }, []); // Dependency array ensures it runs only once on mount

  

  const updateCalendarEvents = (entries) => {
  if (calendarRef.current) {
    calendarRef.current.clear(); // Clear existing events

    // Create events from entries
    const events = entries.map(entry => ({
      id: entry.id,
      title: `${entry.result} 
              (P&L: ${entry.pnl})`, // Adding pnl to the title
      start: entry.date, // Start time at the beginning of the day
      end: new Date(new Date(entry.date).setHours(23, 59, 59)), // End time at the end of the day
      color: entry.result === 'win' ? '#00ff00' : 
             entry.result === 'loss' ? '#ff0000' : 
             '#ffff00', // Yellow for break-even
      isAllDay: true, // Mark as all-day event
      category: 'allday' // Category for all-day events
    }));

    // Create schedules in the calendar
    calendarRef.current.createSchedules(events);
    calendarRef.current.render(true); // Render the calendar
  }
};


  const toggleEntryView = (entryId) => {
    setSelectedEntryId(prevId => prevId === entryId ? null : entryId);
  };

  const deleteEntry = async (entryId) => {
    try {
      if (entryId) {
        const response = await api.delete(`api/delete-journal-entry/${entryId}/`); 
        if (response.status === 204) {
          console.log('Entry deleted successfully');
          await fetchJournalEntries(); // Ensure entries are refetched after deletion
        }
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const updateEntry = (entryId) => {
    if (entryId) {
      navigate(`/update-entry/${entryId}/`, { state: { entryId } });
    } else {
      console.error('No entry ID provided');
    }
  };

  const goToPreviousMonth = () => {
  if (calendarRef.current) {
    calendarRef.current.prev();
  }
};

const goToCurrentMonth = () => {
  if (calendarRef.current) {
    calendarRef.current.today(); // Reset to the current month
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor text-white">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-center items-center mb-8">
            <button
              onClick={handleGoToJournalEntry}
              className="bg-tertiaryColor hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-full flex items-center transition-colors duration-300 shadow-lg"
            >
              <PlusCircle className="mr-2" size={24} />
              Add New Entry
            </button>
          </div>

         

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Daily Trading Profit</h2>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <CombinedPerformanceChart />
              </div>
             
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Performance Chart</h2>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <canvas id="myChart" className="min-h-[300px]"></canvas>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Calendar</h2>
            <div className='flex justify-evenly mb-4'>
              <button className='bg-tertiaryColor hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300 shadow-md' id="prevMonthButton" onClick={goToPreviousMonth}>Previous Month</button>
              <button className='bg-tertiaryColor hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300 shadow-md' id="todayMonthButton" onClick={goToCurrentMonth}>Current Month</button>
            </div>
            <div id="calendar" className="min-h-[300px] bg-white bg-opacity-20 rounded-lg"></div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold p-6 border-b border-gray-200 border-opacity-20 text-white">Trade Entries</h2>
            {entries.length === 0 ? (
              <p className="p-6 text-gray-300">No entries found.</p>
            ) : (
              <ul className="divide-y divide-gray-200 divide-opacity-20">
                {entries.slice(0,5).map((entry) => (
                  <li key={entry.id} className="p-6 hover:bg-white hover:bg-opacity-5 transition-colors duration-300">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{entry.pair} - {entry.date}</span>
                      <button
                        onClick={() => toggleEntryView(entry.id)}
                        className="text-tertiaryColor hover:text-yellow-300 font-bold flex items-center transition-colors duration-300"
                      >
                        {selectedEntryId === entry.id ? (
                          <>
                            Close <ChevronUp className="ml-1" size={20} />
                          </>
                        ) : (
                          <>
                            View <ChevronDown className="ml-1" size={20} />
                          </>
                        )}
                      </button>
                    </div>
                    {selectedEntryId === entry.id && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
                      <div className="flex flex-col justify-center space-y-2">
                        {['Entry Price', 'Stop Loss', 'Target', 'Lot Size', 'Result', 'PnL'].map((field) => {
                          // Adjust key mapping for "Stop Loss" and "Target"
                          const fieldKey = field === 'Stop Loss' ? 'stop_loss_price' : field === 'Target' ? 'target_price' : field.toLowerCase().replace(' ', '_');
                          return (
                            <p key={field} className='text-sm'>
                              <span className="font-medium uppercase mr-2">{field}:</span>
                              {entry[fieldKey]}
                            </p>
                          );
                        })}
                      </div>
                  
                    
                  
                        <div className="flex justify-center items-center">
                        {entry.images && entry.images.length > 0 && (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {entry.images.map((imageObj) => (
          <img
            key={imageObj.id}
            src={getFullImageUrl(imageObj.image)}
            alt={`Trade Image ${imageObj.id}`}
            className="rounded-md max-w-full h-auto"
          />
        ))}
      </div>
    )}
                        </div>
                    
                        <div className="md:col-span-2 flex space-x-4 mt-4">
                          <button
                            onClick={() => updateEntry(entry.id)}
                            className="bg-tertiaryColor hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300 shadow-md flex-grow"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 shadow-md flex-grow"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard