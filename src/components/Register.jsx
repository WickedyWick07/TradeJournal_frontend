import React, {useState , useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const {register, login} = useContext(AuthContext)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await register(username, first_name, last_name, email, password)
            if(response.success){
              try {
                    const loginResponse = await login(email, password)
                   if (loginResponse.success) {
                       navigate('/account-creation')
                    } else {
                        setMessage('Registration successful, but automatic login failed. Please log in manually.')
                    }
               } catch (loginError) {
                   console.error("Error logging in after registration", loginError)
                   setMessage('Registration successful, but automatic login failed. Please log in manually.')
               }
            }
            }
        catch (error) {
            console.error("Error registering user", error.response ? error.response.data : "Error registering data")
        }
    }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primaryColor to-secondaryColor  items-center justify-center ">
      <div className='shadow-2xl m-4 p-4 '>
      <form className='flex flex-col justify-center items-center ' onSubmit={handleSubmit}>
      <h1 className='text-tertiaryColor text-xl m-2 font-semibold'>Register</h1>

        <label className='text-sm font-semibold text-white'>First Name</label>
        <input 
        type="text"
        name='first_name'
         className='m-2 p-2 rounded text-center '
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)} />
        <label className='text-sm font-semibold text-white'>Last Name</label>
        <input 
        type="text"
        value={last_name}
        name='last_name'
         className='m-2 p-2 rounded text-center '
        onChange={(e) => setLastName(e.target.value)} />
        <label className='text-sm font-semibold text-white'>Email</label>
        <input 
        type="email"
        value={email}
        name='email'
         className='m-2 p-2 rounded text-center '
        onChange={(e) => setEmail(e.target.value)} />
        <label className='text-sm font-semibold text-white'>Password</label>
        <input 
        type="password"
        value={password}
        name='password'
         className='m-2 p-2 rounded text-center '
        onChange={(e) => setPassword(e.target.value)} />
        <label className='text-sm font-semibold text-white'>Username</label>
        <input 
        type="text"
        value={username}
        name='username'
         className='m-2 p-2 rounded text-center '
        onChange={(e) => setUsername(e.target.value)} />
        <button className='bg-tertiaryColor mx-4 p-2 rounded font-bold' type='submit'>
        Submit
        </button>
        


      </form>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}

    </div>
    </div>
  )
}

export default Register
