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
  const [loading, setLoading] = useState(true)

    
    const getFullImageUrl = (imagePath) => {
      if(!imagePath) return null;
      if (imagePath.startsWith('trade-images')) return imagePath;
      return `${imagePath}`
  
    }

    if(loading) { 
    <div className="text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiaryColor mx-auto"></div>
    <p className="mt-4 text-xl text-gray-600">Loading...</p>
  </div>}
  
    
    useEffect(() => {
      const fetchJournalEntries = async () => {
        try {
          const response = await api.get('api/fetch-all-journal-entries/'
           
          );
          console.log(response.data);
          const entries = response.data
          const sortedEntries= entries.sort((a, b) => new Date(b.date) - new Date(a.date));
          setEntries(sortedEntries);
          setTotalEntries(response.data.totalEntries); 
          setLoading(false) // Assuming the response contains the total count of entries
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-slate-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl border border-slate-700 overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 bg-slate-700 bg-opacity-50 text-teal-300 text-center border-b border-slate-600">
              Journal History
            </h2>
            
            <div className="p-6">
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300 mx-auto"></div>
                  <p className="mt-4 text-xl text-gray-300">Loading...</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {currentEntries.map((entry) => (
                    <li key={entry.id} className="bg-slate-700 bg-opacity-50 rounded-lg shadow-lg overflow-hidden border border-slate-600">
                      <div className="p-4 flex justify-between items-center">
                        <span className="font-medium text-white">{entry.pair} - {entry.date}</span>
                        <button
                          onClick={() => toggleEntryView(entry.id)}
                          className="text-teal-300 hover:text-teal-200 transition-colors duration-300 flex items-center font-medium"
                        >
                          {selectedEntryId === entry.id ? (
                            <>
                              Close <ChevronUp className="ml-1" size={18} />
                            </>
                          ) : (
                            <>
                              View <ChevronDown className="ml-1" size={18} />
                            </>
                          )}
                        </button>
                      </div>
                      
                      {selectedEntryId === entry.id && (
                        <div className="bg-slate-800 p-5 border-t border-slate-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              {['Entry Price', 'Stop Loss', 'Target', 'Lot Size', 'Result', 'PnL'].map((field) => {
                                // Adjust key mapping for "Stop Loss" and "Target"
                                const fieldKey = field === 'Stop Loss' ? 'stop_loss_price' : 
                                                 field === 'Target' ? 'target_price' : 
                                                 field.toLowerCase().replace(' ', '_');
                                return (
                                  <p key={field} className="text-sm flex justify-between items-center bg-slate-700 bg-opacity-40 p-3 rounded-md">
                                    <span className="font-medium uppercase text-teal-300">{field}:</span>
                                    <span className="text-white">{entry[fieldKey]}</span>
                                  </p>
                                );
                              })}
                            </div>
                            
                            {entry.notes && (
                              <div className="bg-slate-700 bg-opacity-40 p-4 rounded-md">
                                <h4 className="text-teal-300 font-medium mb-2">Notes</h4>
                                <p className="text-white text-sm">{entry.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          {entry.images && entry.images.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-teal-300 font-medium mb-3">Trade Images</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {entry.images.map((imageObj) => (
                                  <img
                                    key={imageObj.id}
                                    src={getFullImageUrl(imageObj.image_url)}
                                    alt={`Trade Image ${imageObj.id}`}
                                    className="rounded-md max-w-full h-auto border border-slate-600 hover:border-teal-300 transition-colors duration-300"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => updateEntry(entry.id)}
                              className="bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center shadow-md"
                            >
                              <Edit size={16} className="mr-2" /> Update
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center shadow-md"
                            >
                              <Trash2 size={16} className="mr-2" /> Delete
                            </button>
                            <button
                              onClick={() => handleViewEntry(entry.id)}
                              className="bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center shadow-md"
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
            
            <div className="flex justify-between items-center p-5 border-t border-slate-600">
              <button
                className="bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-5 rounded-md transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronDown className="mr-1 rotate-90" size={16} /> Previous
              </button>
              
              <span className="text-white font-medium px-4 py-2 bg-slate-700 rounded-md">
                Page {currentPage} of {Math.ceil(entries.length / entriesPerPage)}
              </span>
              
              <button
                className="bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-5 rounded-md transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                onClick={nextPage}
                disabled={currentPage === Math.ceil(entries.length / entriesPerPage)}
              >
                Next <ChevronDown className="ml-1 -rotate-90" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default JournalHistory;