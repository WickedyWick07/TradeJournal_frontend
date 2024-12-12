import React, { useEffect, useState } from 'react'
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';
import Header from './Header';

const JournalHistory = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const entriesPerPage = 10; // Number of entries to show per page
  const [totalEntries, setTotalEntries] = useState(0);  // Total number of entries for pagination
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const navigate = useNavigate()

    
    const getFullImageUrl = (imagePath) => {
      if(!imagePath) return null;
      if (imagePath.startsWith('media')) return imagePath;
      return `${import.meta.env.VITE_API_URL}${imagePath}`
  
    }
  
    
    useEffect(() => {
      const fetchJournalEntries = async () => {
        try {
          const response = await api.get('api/fetch-all-journal-entries/'
           
          );
          console.log(response.data);
          const entries = response.data
          const sortedEntries= entries.sort((a, b) => new Date(b.date) - new Date(a.date));
          setEntries(sortedEntries);
          setTotalEntries(response.data.totalEntries);  // Assuming the response contains the total count of entries
        } catch (error) {
          console.log('There was an error fetching the entries', error);
        }
      };
    
      fetchJournalEntries();
    }, [currentPage, entriesPerPage]); 
    
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  // Re-fetch when currentPage or entriesPerPage changes
    
  const nextPage = () => {
    if (currentPage < Math.ceil(entries.length / entriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
        const toggleEntryView = (entryId) => {
            setSelectedEntryId(prevId => prevId === entryId ? null : entryId);
          };
        

    const handleViewEntry = (entryId)=> {
        navigate(`/view-entry/${entryId}/`,{state: {entryId}})
    }


    const updateEntry = (entryId) => {
      navigate(`/update-entry/${entryId}/`, {state: {entryId}})
    }




  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor text-black">
      <Header />
      <div className="max-w-4xl mx-auto bg-secondaryColor rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 bg-tertiaryColor text-black text-center">Journal History</h2>
        <div className="p-6">
          {entries.length === 0 ? (
            <p className="text-gray-500 text-center">No entries found.</p>
          ) : (
            <ul className="space-y-4">
              {currentEntries.map((entry) => (
                <li key={entry.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{entry.pair} - {entry.date}</span>
                    <button
                      onClick={() => toggleEntryView(entry.id)}
                      className="text-tertiaryColor hover:text-yellow-200 transition-colors duration-300 flex items-center"
                    >
                      {selectedEntryId === entry.id ? (
                        <>
                          Close <ChevronUp className="ml-1" size={16} />
                        </>
                      ) : (
                        <>
                          View <ChevronDown className="ml-1" size={16} />
                        </>
                      )}
                    </button>
                  </div>
                  {selectedEntryId === entry.id && (
  <div className="bg-gray-50 p-4 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        {/* Add other entry details here */}
      </div>
      <div>
        {/* Add other entry details here */}
      </div>
    </div>
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
    <div className="mt-4 flex space-x-2">
      <button
        onClick={() => updateEntry(entry.id)}
        className="bg-tertiaryColor hover:bg-yellow-200 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
      >
        <Edit size={16} className="mr-2" /> Update
      </button>
      <button
        onClick={() => deleteEntry(entry.id)}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
      >
        <Trash2 size={16} className="mr-2" /> Delete
      </button>
      <button
        onClick={() => handleViewEntry(entry.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
      >
        <Eye size={16} className="mr-2" /> Full View
      </button>
    </div>
  </div>
)}
                </li>
              ))}
            </ul>
            
          )}
           </div>
           <div className='flex justify-between mx-2 p-4 items-center '> 
        <button
        className='border p-2 rounded text-black font-semibold bg-tertiaryColor border-none' onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className='text-black font-semibold'>Page {currentPage}</span>
        <button
        className='border p-2 rounded text-black font-semibold bg-tertiaryColor border-none'
          onClick={nextPage}
          disabled={currentPage === Math.ceil(entries.length / entriesPerPage)}
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default JournalHistory;