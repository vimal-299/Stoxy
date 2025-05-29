import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const signup = () => {
  const [name, setname] = useState()
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const navigate = useNavigate()

  const handlesubmit = (e) => {
  e.preventDefault();
  axios.post("https://stoxy.onrender.com/user-signup", { name, email, password })
    .then(result => {
      if (result.data.message === "User created") {
        alert("Signup successful!");
        navigate('/login');
      } else if (result.data.message === "Email already exists") {
        alert("This email is already registered.");
      } else {
        alert("Signup failed.");
      }
    })
    .catch(err => {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again later.");
    });
};

  return (
    <div className='h-screen flex items-center justify-center bg-[#F7F6F9]'> 
      <div className="flex flex-col items-center justify-center w-[30vw] h-[70vh] border-solid border-[2px] border-gray-300">
        <h1 className='font-bold text-4xl mb-5'>Welcome to Stoxy</h1>
        <h3 className='ml-3 mb-8 text-sm'>The easy way to keep track of your portfolio and transactions</h3>
        <p>Already have an account ?</p>
        <Link to="/login"><button className='px-3 py-1 bg-black text-white rounded-md mx-4 my-2'>Login</button></Link>
      </div>
      <div className="h-[70vh] w-[30vw] bg-white flex flex-col items-center justify-center border-solid border-[2px] border-gray-300">
        <form onSubmit={handlesubmit} className='gap-8'>
          <h1 className='font-bold text-2xl'>Create Account</h1>
          <input className='block m-4 border-b-2' type="text" placeholder='Enter your name' required onChange={(e)=>{setname(e.target.value)}} />
          <input className='block m-4 border-b-2' type="email" placeholder='Enter your email id' required onChange={(e)=>{setemail(e.target.value)}} />
          <input className='block m-4 border-b-2' type="password" placeholder='Enter your password' required pattern=".*[A-Z].*" title="Password must contain at least one uppercase letter" onChange={(e)=>{setpassword(e.target.value)}} />
          <button className='px-4 py-2 m-8 rounded-lg bg-[#F7F6F9]'>Sign Up</button>
        </form>
      </div>

    </div>
  )
}

export default signup