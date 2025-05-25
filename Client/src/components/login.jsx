import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './AuthContext'

const login = () => {

  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const navigate = useNavigate()
  const { login } = useContext(AuthContext);

  const handlesubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3000/user-login", { email, password })
      .then(result => {
        if (result.data.token) {
          login(result.data.token);
          navigate('/home')
        }
        else if (result.data === "your password is incorrect") {
          alert("Incorrect password")
        }
        else if (result.data === "no user found") {
          alert("User not found")
        }
      });
  };

  return (
    <div className='h-screen flex items-center justify-center bg-[#F7F6F9]'>

      <div className="flex flex-col items-center justify-center w-[30vw] h-[70vh] border-solid border-[2px] border-gray-300">
        <form onSubmit={handlesubmit}>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <input className='block m-4 bg-[#F7F6F9] border-b-2' type="text" placeholder='Enter your email' onChange={(e) => { setemail(e.target.value) }} />
          <input className='block m-4 bg-[#F7F6F9] border-b-2' type="text" placeholder='Enter your password' onChange={(e) => { setpassword(e.target.value) }} />
          <button className='bg-white rounded-lg px-4 py-4 m-8'>Login</button>
        </form>
      </div>

      <div className="h-[70vh] w-[30vw] bg-white flex flex-col items-center justify-center border-solid border-[2px] border-gray-300">
        <h3 className='journey'>Let's Start the Journey</h3>
        <p>New to this site ?</p>
        <Link to="/"><button className='px-3 py-2 bg-black text-white rounded-md mx-4 my-8'>Sign-up</button></Link>
      </div>

    </div>
  )
}

export default login