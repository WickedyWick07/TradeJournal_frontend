import React, { useState, useContext, useEffect } from 'react';
import Header from './Header';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const JournalEntry = () => {
  const navigate = useNavigate();
  const { currentUser, fetchCurrentUser } = useContext(AuthContext);
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [result, setResult] = useState('');
  const [direction, setDirection] = useState('');
  const [pair, setPair] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState([]);
  const [journal, setJournal] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [error, setError] = useState({ entryPrice: '', stopLossPrice: '', targetPrice: '' });
  const [accounts, setAccounts] = useState([]);
  const [accountJournal, setAccountJournal] = useState([]);

  useEffect(() => {
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

    const fetchJournals = async () => {
      try {
        const response = await api.get('api/fetch-trading-journals/');
        console.log('journal:', response.data);
        setAccountJournal(response.data);
      } catch (error) {
        console.error('Error fetching journals', error);
        setError('Error fetching journals');
      }
    };

    if (!currentUser) {
      fetchCurrentUser();
      console.log('Current user is:', currentUser);
    } else {
      console.log('Current user is:', currentUser);
    }

    fetchJournals();
    fetchAccounts();
  }, [currentUser, fetchCurrentUser]);

  const forexPipRegex = /^\d+(\.\d{1,5})?$/;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const fileArray = Array.from(files); // Convert FileList to an array
      
      // Filter out image files
      const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));
  
      // Create preview URLs for each image
      const previews = imageFiles.map((file) => URL.createObjectURL(file));
  
      // Set the image files and their previews in state
      setImage(imageFiles); // Store the files in the state
      setImagePreview(previews); // Store the preview URLs in the state
    }  else {
      if (name === 'entryPrice' || name === 'stopLossPrice' || name === 'targetPrice') {
        if (forexPipRegex.test(value) || value === '') {
          setError((prevError) => ({ ...prevError, [name]: '' }));
          if (name === 'entryPrice') setEntryPrice(value);
          if (name === 'stopLossPrice') setStopLossPrice(value);
          if (name === 'targetPrice') setTargetPrice(value);
        } else {
          setError((prevError) => ({
            ...prevError,
            [name]: 'Invalid pip format (up to 4 decimal places)',
          }));
        }
      } else if (name === 'lotSize') {
        setLotSize(value);
      } else {
        if (name === 'result') setResult(value);
        if (name === 'direction') setDirection(value);
        if (name === 'pair') setPair(value);
        if (name === 'text') setText(value);
        if (name === 'date') setDate(value);
        if (name === 'journal') setJournal(parseInt(value));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error.entryPrice || error.stopLossPrice || error.targetPrice || error.lotSize) {
      console.log('Please correct the errors before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('entry_price', parseFloat(entryPrice).toFixed(3));
    formData.append('stop_loss_price', parseFloat(stopLossPrice).toFixed(3));
    formData.append('target_price', parseFloat(targetPrice).toFixed(3));
    formData.append('result', result.toLowerCase());
    formData.append('direction', direction);
    formData.append('pair', pair);
    formData.append('date', date);
    formData.append('journal', journal);
    formData.append('lot_size', lotSize);
    formData.append('textarea', text);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post('api/create-journal-entry/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor text-black">
      <Header />
      <section className="bg-secondaryColor mx-auto rounded p-6 sm:w-full md:w-3/4 lg:w-1/2">
  <form
    onSubmit={handleSubmit}
    className="flex flex-col space-y-4"
  >
    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="entryPrice">
        Entry Price:
      </label>
      <input
        name="entryPrice"
        onChange={handleChange}
        value={entryPrice}
        className="rounded px-3 py-2 font-semibold w-full"
        type="number"
        step="0.0001"
      />
      {error.entryPrice && <p className="text-red-500 text-sm">{error.entryPrice}</p>}
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="stopLossPrice">
        Stop Loss Price:
      </label>
      <input
        name="stopLossPrice"
        onChange={handleChange}
        value={stopLossPrice}
        className="rounded px-3 py-2 font-semibold w-full"
        type="number"
        step="0.0001"
      />
      {error.stopLossPrice && <p className="text-red-500 text-sm">{error.stopLossPrice}</p>}
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="targetPrice">
        Target Price:
      </label>
      <input
        name="targetPrice"
        onChange={handleChange}
        value={targetPrice}
        className="rounded px-3 py-2 font-semibold w-full"
        type="number"
        step="0.0001"
      />
      {error.targetPrice && <p className="text-red-500 text-sm">{error.targetPrice}</p>}
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="lotSize">
        Lot Size:
      </label>
      <input
        name="lotSize"
        onChange={handleChange}
        value={lotSize}
        className="rounded px-3 py-2 font-semibold w-full"
        type="number"
        step="0.0001"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="result">
        Result:
      </label>
      <select
        name="result"
        className="rounded px-3 py-2 font-semibold w-full"
        onChange={handleChange}
        value={result}
      >
        <option value="">Enter your result</option>
        <option value="Win">Win</option>
        <option value="Loss">Loss</option>
        <option value="Break-even">Break-even</option>
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="direction">
        Trade Direction:
      </label>
      <select
        name="direction"
        className="rounded px-3 py-2 font-semibold w-full"
        onChange={handleChange}
        value={direction}
      >
        <option value="">Enter your Trade Direction</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="pair">
        Pair:
      </label>
      <input
        name="pair"
        onChange={handleChange}
        value={pair}
        className="rounded px-3 py-2 font-semibold w-full"
        type="text"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="thoughts">
        Thoughts:
      </label>
      <textarea
        className="rounded px-3 py-2 font-semibold text-sm w-full"
        onChange={handleChange}
        value={text}
        name="text"
        id="text"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="date">
        Enter Trade Date:
      </label>
      <input
        name="date"
        onChange={handleChange}
        value={date}
        className="border rounded px-3 py-2 bg-gray-600 text-white w-full"
        type="date"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="journal">
        Select Trading Account to Save to:
      </label>
      <select
        name="journal"
        className="rounded px-3 py-2 w-full"
        value={journal}
        onChange={handleChange}
      >
        <option value="">Select an account</option>
        {accountJournal.map((journal) => (
          <option key={journal.id} value={journal.id}>
            {journal.title} (Account: {accounts.find((acc) => acc.id === journal.account)?.account_number})
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-white font-semibold mb-1" htmlFor="image">
        Upload Image:
      </label>
      <input
        name="image"
        onChange={handleChange}
        className="rounded px-3 py-2 w-full"
        type="file"
        accept="image/*"
        multiple
      />
      {imagePreview.length > 0 && (
  <div className="mt-2 mx-auto flex space-x-2">
    {imagePreview.map((preview, index) => (
      <img
        key={index}
        src={preview}
        alt={`Preview ${index}`}
        className="w-32 h-32 object-cover"
      />
    ))}
  </div>
)}

    </div>

    <button
      type="submit"
      className="bg-yellow-600 hover:bg-tertiaryColor p-3 text-white font-semibold rounded w-full"
    >
      Submit
    </button>
  </form>
</section>

    </div>
  );
};

export default JournalEntry;
