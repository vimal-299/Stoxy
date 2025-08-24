
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Loader from './Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("https://stoxy.onrender.com/user-login", { email, password })
      .then(result => {
        setLoading(false);
        if (result.data.token) {
          login(result.data.token);
          navigate('/home');
        } else if (result.data === "your password is incorrect") {
          alert("Incorrect password");
        } else if (result.data === "no user found") {
          alert("User not found");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400">
      {loading && <Loader />}
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-indigo-100 to-white">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Welcome Back</h1>
          <p className="mb-8 text-indigo-500">Sign in to your Stoxy account</p>
          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
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
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-2">New to Stoxy?</h2>
          <p className="mb-6">Create an account and start your paper trading journey!</p>
          <Link to="/signup">
            <button className="px-6 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;