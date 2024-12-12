import React, { useEffect, useRef, useState } from 'react';
import TuiCalendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import api from '../services/api';
import Header from './Header';
import PerformanceChart from './PerformanceChart';

const MyCalendar = () => {
  const calendarRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [accountEntries, setAccountEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilteredAccount] = useState(null);

  const renderJournalEntries = () => {
    if (!accountEntries || accountEntries.length === 0) {
      return <p className="text-white text-xl font-bold italic">No entries found for this account.</p>;
    }

    const sortedEntries = accountEntries.sort((a,b) => new Date(b.date) - new Date(a.date) )

    return (
      <div className="rounded overflow-x-auto">
        <table className=" min-w-full bg-white">
          <thead className="bg-tertiaryColor text-white">
            <tr>
              <th className="py-2 px-4 font-semibold text-left">Date</th>
              <th className="py-2 px-4 font-semibold text-left">Pair</th>
              <th className="py-2 px-4 font-semibold text-left">Direction</th>
              <th className="py-2 px-4 font-semibold text-left">Entry Price</th>
              <th className="py-2 px-4 font-semibold text-left">PNL</th>
              <th className="py-2 px-4 font-semibold text-left">Result</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-100">
                <td className="py-2 font-semibold px-4">{entry.date}</td>
                <td className="py-2 font-semibold px-4">{entry.pair}</td>
                <td className="py-2 font-semibold px-4 capitalize">{entry.direction}</td>
                <td className="py-2 font-semibold px-4">{entry.entry_price}</td>
                <td className="py-2 font-semibold px-4">${entry.pnl}</td>
                <td className={`py-2 px-4 capitalize font-semibold ${entry.result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const fetchAccounts = async () => {
    try {
      const response = await api.get('fetch-accounts/');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts', error);
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await api.get('fetch-all-journal-entries/');
      setEntries(response.data);
      setFilteredEntries(response.data);
    } catch (error) {
      console.error('There was an error fetching the entries', error);
    }
  };

  const fetchAccountEntries = async (accountId) => {
    console.log('Fetching entries for Account ID:', accountId);
  
    try {
      const response = await api.get('journal-entries/', {
        params: { account_id: accountId }
      });
      console.log('Account entries:', response.data);
      setAccountEntries(response.data.results); // Assuming the response is paginated
      setFilteredEntries(response.data.results);
    } catch (error) {
      console.error('Error fetching account entries:', error);
    }
  };

  const updateCalendarEvents = (entries) => {
    if (calendarRef.current) {
      calendarRef.current.clear();
      const events = entries.map((entry) => ({
        id: entry.id,
        title: entry.result,
        start: entry.date,
        end: entry.date,
        color: entry.result === 'win' ? '#00ff00' : entry.result === 'loss' ? '#ff0000' : '#ffff00',
        isAllDay: true,
        category: 'allday',
      }));
      console.log('Calendar events:', events);
      calendarRef.current.createSchedules(events);
      calendarRef.current.render(true);
    }
  };

  useEffect(() => {
    const initializeCalendar = () => {
      calendarRef.current = new TuiCalendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: false,
        useDetailPopup: true,
        isReadOnly: true,
        month: {
          daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          startDayOfWeek: 0,
        },
      });
    };

    initializeCalendar();
    fetchAccounts();
    fetchJournalEntries();

    return () => {
      if (calendarRef.current) {
        calendarRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    console.log('filteredEntries updated:', filteredEntries);
    updateCalendarEvents(filteredEntries);
  }, [filteredEntries]);

  const handleAccountChange = async (e) => {
    const selectedAccountId = e.target.value;
    console.log('Selected Account ID:', selectedAccountId);
    
    if (selectedAccountId !== 'default') {
      try {
        await fetchAccountEntries(selectedAccountId);
        
        const selectedAccount = accounts.find(account => account.id === parseInt(selectedAccountId, 10));
        setFilteredAccount(selectedAccount);
        
      } catch (error) {
        console.error('Error fetching account-specific entries:', error);
      }
    } else {
      setFilteredEntries(entries);
      setAccountEntries([]);
      setFilteredAccount(null);
    }
  };

  const goToPreviousMonth = () => {
    if (calendarRef.current) {
      calendarRef.current.prev();
    }
  };
  
  const goToCurrentMonth = () => {
    if (calendarRef.current) {
      calendarRef.current.today();
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor p-8">
      <div className="max-w-7xl mx-auto bg-opacity-90 rounded-xl shadow-2xl overflow-hidden">
        <Header className="bg-tertiaryColor text-white p-6 text-2xl font-bold" />
        
        <div className="p-8">
          <div className="mb-8">
            <select 
              onChange={handleAccountChange}
              className="w-full p-3 border font-semibold text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiaryColor focus:border-tertiaryColor"
            >
              <option className='font-semibold' value="default">Select an account to view</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_number} - {account.broker}
                </option>
              ))}
            </select>

            {filteredAccount && (
              <div className="mt-6 p-4 bg-tertiaryColor bg-opacity-10 rounded-lg">
                <p className="text-lg text-white font-semibold mb-2">
                  <strong className="text-tertiaryColor">Account Number:</strong> {filteredAccount.account_number}
                </p>
                <p className="text-lg text-white font-semibold mb-2">
                  <strong className="text-tertiaryColor">Broker:</strong> {filteredAccount.broker}
                </p>
                <p className="text-lg text-white font-semibold">
                  <strong className="text-tertiaryColor">Account Balance:</strong> ${filteredAccount.account_balance}
                </p>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-6 text-tertiaryColor">Trade Calendar</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <h3 className="text-xl font-semibold p-4 bg-tertiaryColor text-white">Calendar</h3>
              <div className="flex justify-evenly p-4 bg-gray-100">
                <button 
                  onClick={goToPreviousMonth} 
                  className="px-4 py-2 bg-tertiaryColor text-white rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out"
                >
                  Previous Month
                </button>
                <button 
                  onClick={goToCurrentMonth} 
                  className="px-4 py-2 bg-tertiaryColor text-white rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out"
                >
                  Current Month
                </button>
              </div>
              <div id="calendar" className="min-h-[400px] p-4"></div>
            </div>

            <PerformanceChart 
              filteredAccount={filteredAccount} 
              accountEntries={accountEntries}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            />


            <h2 className="text-3xl font-bold mb-6 text-tertiaryColor text-center my-auto">Journal Entries</h2>
            {renderJournalEntries()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;