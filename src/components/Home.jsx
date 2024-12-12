import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { BarChart, LineChart, PieChart, Users } from 'lucide-react';
import heroImg from '../assets/hero-img.webp/'


import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor">
      <div className='text-5xl font-serif flex justify-center p-4 text-center'>
        <h2 className='text-tertiaryColor text-center'>Trade Journal </h2> 
      </div>
      <div className='flex justify-center'>
        <h2 className='text-xl text-white uppercase font-semibold m-4 p-2'>Your trading journal that helps you visualize your trades</h2>
      </div>

        
      <div 
        className='border flex justify-center items-center border-none min-h-48 min-w-20 bg-slate-400 px-20'
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '300px', // Set a height for the div
        }}
      >
          <div className='flex justify-center items-center space-x-10'>
  <button 
    className='font-semibold text-center hover:bg-amber-300 underline bg-tertiaryColor p-4 text-xl rounded' 
    onClick={() => navigate('/register')}
  >
    Sign Up
  </button>
  
  <button 
    className='font-semibold text-center  hover:bg-amber-300 underline bg-tertiaryColor p-4 text-xl rounded' 
    onClick={() => navigate('/login')}
  >
    Login
  </button>
</div>
        </div>

        <section className='flex justify-between'>
  <div className='border p-4 bg-tertiaryColor rounded m-6 border-none'>
    <p className='text-black text-xl font-semibold'>
      A trading journal is essential for tracking your trades and performance. It allows you to record the details of each trade, including entry/exit points, trade rationale, and outcome. By logging your trades consistently, you can identify patterns and areas for improvement.
    </p>
  </div>

  <div className='border p-4 bg-tertiaryColor rounded m-6 border-none'>
    <p className='text-black text-xl font-semibold'>
      Our trading journal also provides powerful analysis tools. You can generate reports to analyze your trading strategy, track your win/loss ratios, and evaluate the effectiveness of your decisions. This data-driven approach helps you refine your strategy and improve over time.
    </p>
  </div>
</section>

<section className='flex justify-center border-none rounded-full bg-black p-3 m-3'>
  <div className='p-5'>
    <p className='text-white text-xl font-semibold space-x-2'>
      Consistency is key in trading. With a well-maintained journal, you can hold yourself accountable, avoid emotional trading, and stay disciplined in following your trading plan. Use our platform to keep a detailed log of your trades, identify successful patterns, and grow your trading skills.
    </p>
  </div>
</section>


<section className='flex justify-center'>
      <div classname='flex justify-center'>
        {/* Bar Chart Icon */}
        <BarChart size={64} className='m-4  text-white' />
        <div className='border m-2 bg-white rounded border-none'>
          <p className='text-md font-semibold p-3'>
            According to recent statistics, traders who consistently keep a trading journal show a 25% increase in profitability. Keeping detailed logs helps identify profitable patterns and reduce emotional trades.
          </p>
        </div>
      </div>

      <div>
        {/* Line Chart Icon */}
        <LineChart size={64} className='m-4 text-white' />
        <div className='border m-2 bg-white rounded border-none'>
          <p className='text-md font-semibold p-3'>
            A study shows that traders who analyze their trades using performance metrics such as risk/reward ratios and win/loss ratios are 30% more likely to succeed in long-term trading.
          </p>
        </div>
      </div>

      <div>
        {/* Pie Chart Icon */}
        <PieChart size={64} className='m-4  text-white' />
        <div className='border m-2 bg-white rounded border-none'>
          <p className='text-md font-semibold p-3'>
            Diversification in trading is key. Over 70% of successful traders spread their investments across different asset classes, reducing risk and improving long-term returns.
          </p>
        </div>
      </div>

      <div>
        {/* Community Icon */}
        <Users size={64} className='m-4  text-white' />
        <div className='border m-2 bg-white rounded border-none'>
          <p className='text-md font-semibold p-3'>
            Being part of a trading community boosts accountability and knowledge sharing. Over 60% of traders report improved performance when actively engaging with a community of peers, sharing insights, and learning from collective experiences.
          </p>
        </div>
      </div>
    </section>
        <div>
          <footer>
            <Footer />

          </footer>
        </div>
    </div>
  )
}

export default Home
