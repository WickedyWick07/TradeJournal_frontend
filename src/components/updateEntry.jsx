import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ensure this import is correct
import Header from './Header';

const UpdateEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const { entryId } = location.state;
  const [error, setError] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]); // Store multiple image previews

  useEffect(() => {
    const fetchEntry = async () => {
      if (entryId) {
        try {
          const response = await api.get(`api/fetch-journal-entry/${entryId}/`);
          console.log(response.data);
          setEntry(response.data);
          if (response.data.image) {
            setImagePreviews([response.data.image]); // Assuming the response has a single image
          }
        } catch (error) {
          console.error('Failed to fetch entry', error);
        }
      } else {
        console.error('No entry Id provided');
        navigate('/dashboard');
      }
    };

    fetchEntry();
  }, []);

  const getFullImageUrl = (imagePath) => {
    if(!imagePath) return null;
    if (imagePath.startsWith('media')) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`

  }


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files.length > 0) {
        const fileArray = Array.from(files);
        setEntry({ ...entry, [name]: fileArray }); // Store files in the entry state
        const previewUrls = fileArray.map(file => URL.createObjectURL(file)); // Create preview URLs
        setImagePreviews(previewUrls); // Update image previews
      }
    } else {
      setEntry({ ...entry, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry || !entry.id) {
      console.error("Invalid entry or entry ID");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in entry) {
        if (key === 'image') {
          // Append multiple images to the FormData
          if (Array.isArray(entry[key])) {
            entry[key].forEach(file => formData.append(key, file));
          }
        } else if (entry[key]) {
          formData.append(key, entry[key]);
        }
      }

      await api.put(`api/update-journal-entry/${entry.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating journal entry', error);
      setError(error.response?.data || { general: 'An error occurred while updating the entry' });
    }
  };

  if (!entry) return (
    <div className=' min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor'>
      <div className='w-24 h-24 border rounded-full animate-spin  bg-blue-200 text-center flex justify-center'></div>
      Loading
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor text-white">
      <Header />
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Price */}
          <div>
            <label className="block text-lg mb-2" htmlFor="entryPrice">Entry Price:</label>
            <input
              name="entry_price"
              onChange={handleChange}
              value={entry.entry_price}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              type="number"
              step="0.0001"
            />
            {error.entry_price && <p className="text-red-500 mt-1">{error.entry_price}</p>}
          </div>

          {/* Stop Loss Price */}
          <div>
            <label className="block text-lg mb-2" htmlFor="stopLossPrice">Stop Loss Price:</label>
            <input
              name="stop_loss_price"
              onChange={handleChange}
              value={entry.stop_loss_price}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              type="number"
              step="0.0001"
            />
            {error.stop_loss_price && <p className="text-red-500 mt-1">{error.stop_loss_price}</p>}
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-lg mb-2" htmlFor="targetPrice">Target Price:</label>
            <input
              name="target_price"
              onChange={handleChange}
              value={entry.target_price}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              type="number"
              step="0.0001"
            />
            {error.target_price && <p className="text-red-500 mt-1">{error.target_price}</p>}
          </div>

          {/* Result */}
          <div>
            <label className="block text-lg mb-2" htmlFor="result">Result:</label>
            <select
              name="result"
              onChange={handleChange}
              value={entry.result}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Result</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="break-even">Break-even</option>
            </select>
            {error.result && <p className="text-red-500 mt-1">{error.result}</p>}
          </div>

          {/* Pair */}
          <div>
            <label className="block text-lg mb-2" htmlFor="pair">Pair:</label>
            <input
              name="pair"
              onChange={handleChange}
              value={entry.pair}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              type="text"
            />
            {error.pair && <p className="text-red-500 mt-1">{error.pair}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-lg mb-2" htmlFor="date">Trade Date:</label>
            <input
              name="date"
              onChange={handleChange}
              value={entry.date}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              type="date"
            />
            {error.date && <p className="text-red-500 mt-1">{error.date}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg mb-2" htmlFor="image">Trade (Image or PDF):</label>
            <input
              name="image"
              onChange={handleChange}
              multiple
              type="file"
              accept=".png, .jpg, .jpeg, .gif, .pdf"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Image Previews:</h3>
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Trade Preview ${index + 1}`}
                    className="rounded max-w-full h-auto"
                    style={{ maxHeight: '200px' }}
                  />
                ))}
              </div>
            )}
            {error.image && <p className="text-red-500 mt-1">{error.image}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Update Entry
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEntry;
