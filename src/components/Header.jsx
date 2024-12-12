import React, {useState} from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  const {logout}= useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('/dashboard');


  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  const navItems = [
    { path: '/journal-history', label: 'View Entries' },
    { path: '/detail-calendar', label: 'Detailed Account Performance' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className='bg-gradient-to-r from-primaryColor to-secondaryColor shadow-lg'>
      <div className='container mx-auto px-4 py-6'>
        <h1 className='text-tertiaryColor text-4xl text-center font-serif mb-6'>Trade Journal</h1>
        <nav>
          <ul className='flex flex-wrap justify-center gap-4'>
            {navItems.map((item) => (
              <li key={item.path}>
                <button 
                  className={`text-black font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:scale-105 ${
                    activeTab === item.path
                      ? 'bg-tertiaryColor shadow-md scale-105'
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <button 
                className='text-white bg-red-500 hover:bg-red-600 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:scale-105' 
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header
