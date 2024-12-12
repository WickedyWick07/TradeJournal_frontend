import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      console.error('Login error:', result.error); // Log the error returned from the login function
    }
  };

  return (
   <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor  items-center justify-center ">
      <div className='shadow-lg m-4 p-4 bg-primaryColor rounded'>
      <form className='flex flex-col justify-center items-center  ' onSubmit={handleSubmit}>
        <h1 className='text-tertiaryColor text-xl m-2 font-semibold'>Login</h1>
        <label className='text-sm font-semibold text-white'>Email</label>
        <input
          type="email"
          className='m-2 p-2 rounded text-center '
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className='text-sm font-semibold text-white'>Password</label>
        <input
          type="password"
          className='m-2 p-2 rounded text-center '
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='bg-tertiaryColor mx-4 p-2 rounded font-bold' type='submit'>
          Login
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;
