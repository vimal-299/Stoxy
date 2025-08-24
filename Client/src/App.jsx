import React from 'react'
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/dashboard"
import Myprofile from "./components/myprofile"
import Portfolio from "./components/portfolio"
import Transactions from "./components/transactions"
import Stockdetail from "./components/stockdetail"
import Signup from './components/signup';
import Login from "./components/login"
import Landing from './components/Landing';
import { ValuesProvider } from './components/contexts';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <>
      <AuthProvider>
        <ValuesProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/myprofile" element={<PrivateRoute><Myprofile /></PrivateRoute>} />
            <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/stocks/:companyname" element={<PrivateRoute><Stockdetail /></PrivateRoute>} />
          </Routes>
        </ValuesProvider>
      </AuthProvider>
    </>
  )
}

export default App
