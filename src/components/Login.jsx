import  { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-8 border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-500 p-3 rounded-full">
            <LogIn size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-teal-300 text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              name="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <button 
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-300 shadow-md flex items-center justify-center"
              type="submit"
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate('/register')}
              className="text-teal-300 hover:text-teal-200 font-medium underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;