import React, { useEffect, useState } from 'react'
import api from '../services/api'
import {  useLocation, useNavigate } from 'react-router-dom'
import { DollarSign, TrendingDown, TrendingUp, Calendar, BarChart2,ArrowLeft, Receipt, ReceiptText, Text } from 'lucide-react';

const ViewEntry = () => {
    const location = useLocation()
    const {entryId} = location.state
    const [entry, setEntry] = useState(null)
    const navigate = useNavigate()

    
    const getFullImageUrl = (imagePath) => {
      if(!imagePath) return null;
      if (imagePath.startsWith('media')) return imagePath;
      return `${import.meta.env.VITE_API_URL}${imagePath}`
  
    }
  

    useEffect(() => {
        const fetchEntry = async () => {

            try {
                const response = await api.get(`api/fetch-journal-entry/${entryId}`)
                console.log(response.data)
                setEntry(response.data)
            } catch (error) {
                console.log("Error fetching ENtry", error)
                
            }
        }

        fetchEntry()
    }, [])

   
  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor text-black">
      <div className="max-w-2xl mx-auto bg-secondaryColor rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 bg-tertiaryColor text-black">Trade Entry Details</h2>
        <div className="p-6">
          <button className='my-4 font-semibold bg-color bg-tertiaryColor rounded p-2' onClick={() => navigate('/journal-history')}  > <ArrowLeft size={20} /></button>
          {entry ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <DollarSign size={20} className="mr-2 text-tertiaryColor" />
                    Entry Price
                  </h3>
                  <p className="text-2xl font-bold text-gray-700">{entry.entry_price}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <TrendingDown size={20} className="mr-2 text-red-500" />
                    Stop Loss Price
                  </h3>
                  <p className="text-2xl font-bold text-gray-700">{entry.stop_loss_price}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <TrendingUp size={20} className="mr-2 text-green-500" />
                    Target Price
                  </h3>
                  <p className="text-2xl font-bold text-gray-700">{entry.target_price}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <BarChart2 size={20} className="mr-2 text-blue-500" />
                    Pair
                  </h3>
                  <p className="text-2xl font-bold text-gray-700">{entry.pair}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <ReceiptText size={20} className="mr-2 text-blue-500" />
                    Result
                  </h3>
                  <p className="text-2xl font-bold text-gray-700 uppercase">{entry.result}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <Receipt size={20} className="mr-2 text-blue-500" />
                    PnL
                  </h3>
                  <p className="text-2xl font-bold text-gray-700">{entry.pnl}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Calendar size={20} className="mr-2 text-purple-500" />
                  Date
                </h3>
                <p className="text-2xl font-bold text-gray-700">{entry.date}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Text size={20} className="mr-2 text-purple-500" />
                  Thoughts
                </h3>
                <p className="text-md font-bold text-gray-700">{entry.textarea == null ? "No thoughts entered" : entry.textarea }</p>
              </div>
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
    
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiaryColor mx-auto"></div>
              <p className="mt-4 text-xl text-gray-600">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewEntry
