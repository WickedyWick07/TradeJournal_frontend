
import Footer from './Footer'
import { BarChart, LineChart, PieChart, Users } from 'lucide-react';
import heroImg from '../assets/hero-img.webp/'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className='text-5xl font-serif flex justify-center p-6 text-center'>
        <h2 className='text-teal-300 text-center font-bold'>Trade Journal</h2> 
      </div>
      <div className='flex justify-center'>
        <h2 className='text-xl text-white uppercase font-semibold m-4 p-2'>Your trading journal that helps you visualize your trades</h2>
      </div>

      <div 
        className='flex justify-center items-center border-none min-h-48 min-w-20 px-20 shadow-xl'
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '300px',
          position: 'relative',
        }}
      >
        {/* Dark overlay for better button visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className='flex justify-center items-center space-x-10 relative z-10'>
          <button 
            className='font-semibold text-center hover:bg-teal-400 bg-teal-500 p-4 text-xl rounded-full text-white transition-colors duration-300 shadow-lg' 
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
          
          <button 
            className='font-semibold text-center hover:bg-teal-400 bg-teal-500 p-4 text-xl rounded-full text-white transition-colors duration-300 shadow-lg' 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>

      <section className='flex justify-between px-6 py-8'>
        <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-6 m-4 flex-1 border border-slate-700'>
          <p className='text-white text-lg'>
            A trading journal is essential for tracking your trades and performance. It allows you to record the details of each trade, including entry/exit points, trade rationale, and outcome. By logging your trades consistently, you can identify patterns and areas for improvement.
          </p>
        </div>

        <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-6 m-4 flex-1 border border-slate-700'>
          <p className='text-white text-lg'>
            Our trading journal also provides powerful analysis tools. You can generate reports to analyze your trading strategy, track your win/loss ratios, and evaluate the effectiveness of your decisions. This data-driven approach helps you refine your strategy and improve over time.
          </p>
        </div>
      </section>

      <section className='mx-6 my-8 bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-6 border border-slate-700'>
        <div className='p-2'>
          <p className='text-white text-xl font-semibold'>
            Consistency is key in trading. With a well-maintained journal, you can hold yourself accountable, avoid emotional trading, and stay disciplined in following your trading plan. Use our platform to keep a detailed log of your trades, identify successful patterns, and grow your trading skills.
          </p>
        </div>
      </section>

      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-8'>
        <div className='flex flex-col items-center'>
          <BarChart size={64} className='m-4 text-teal-300' />
          <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-4 h-full border border-slate-700'>
            <p className='text-white p-2'>
              According to recent statistics, traders who consistently keep a trading journal show a 25% increase in profitability. Keeping detailed logs helps identify profitable patterns and reduce emotional trades.
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <LineChart size={64} className='m-4 text-teal-300' />
          <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-4 h-full border border-slate-700'>
            <p className='text-white p-2'>
              A study shows that traders who analyze their trades using performance metrics such as risk/reward ratios and win/loss ratios are 30% more likely to succeed in long-term trading.
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <PieChart size={64} className='m-4 text-teal-300' />
          <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-4 h-full border border-slate-700'>
            <p className='text-white p-2'>
              Diversification in trading is key. Over 70% of successful traders spread their investments across different asset classes, reducing risk and improving long-term returns.
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <Users size={64} className='m-4 text-teal-300' />
          <div className='bg-slate-800 bg-opacity-70 rounded-lg shadow-xl p-4 h-full border border-slate-700'>
            <p className='text-white p-2'>
              Being part of a trading community boosts accountability and knowledge sharing. Over 60% of traders report improved performance when actively engaging with a community of peers, sharing insights, and learning from collective experiences.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default Home