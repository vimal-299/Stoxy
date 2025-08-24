
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("https://stoxy.onrender.com/user-signup", { name, email, password })
      .then(result => {
        setLoading(false);
        if (result.data.message === "User created") {
          alert("Signup successful!");
          navigate('/login');
        } else if (result.data.message === "Email already exists") {
          alert("This email is already registered.");
        } else {
          alert("Signup failed.");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400">
      {loading && <Loader />}
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        <div className="hidden md:flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-2">Already have an account?</h2>
          <p className="mb-6">Sign in to manage your portfolio and wishlist!</p>
          <Link to="/login">
            <button className="px-6 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition">Login</button>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-indigo-100 to-white">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Create Account</h1>
          <p className="mb-8 text-indigo-500">Start your paper trading journey with Stoxy</p>
          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
            <input
              className="w-full px-4 py-2 border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500 bg-transparent text-indigo-700 placeholder-indigo-400"
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-2 border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500 bg-transparent text-indigo-700 placeholder-indigo-400"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-2 border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500 bg-transparent text-indigo-700 placeholder-indigo-400"
              type="password"
              placeholder="Password (at least 1 uppercase letter)"
              value={password}
              pattern={".*[A-Z].*"}
              title="Password must contain at least one uppercase letter"
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;