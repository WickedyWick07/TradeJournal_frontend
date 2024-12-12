import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Register from './components/Register';
import Login from './components/Login';
import JournalEntry from './components/JournalEntry'
import Dashboard from './components/Dashboard';
import UpdateEntry from './components/updateEntry';
import { AuthProvider } from './context/AuthContext';
import DetailCalendarView from './components/DetailCalendarView';
import JournalHistory from './components/JournalHistory';
import ViewEntry from './components/ViewEntry';
import AccountCreation from './components/AccountCreation';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} /> 
            <Route path='/register' element={<Register />} /> 
            <Route path='/login' element={<Login />} /> 
            <Route path='/dashboard' element={<Dashboard />} /> 
            <Route path='/journal-entry' element={<JournalEntry />} /> 
            <Route path='/journal-history' element={<JournalHistory />} /> 
            <Route path='/view-entry/:id' element={<ViewEntry />} /> 
            <Route path='/detail-calendar' element={<DetailCalendarView />} /> 
            <Route path='/account-creation' element={<AccountCreation />} /> 
            <Route path='/update-entry/:id' element={<UpdateEntry />} /> 

          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
