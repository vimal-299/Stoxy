import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 text-white">
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-bold tracking-tight">Stoxy</div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 rounded bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition">Login</Link>
          <Link to="/" className="px-4 py-2 rounded border border-white font-semibold hover:bg-white hover:text-indigo-600 transition">Sign Up</Link>
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Paper Trade. Track. Grow.</h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-8 opacity-90">Stoxy lets you explore stocks, build your portfolio, and manage a wishlist—all without real money. Experience the thrill of trading, risk-free!</p>
        <div className="space-x-4">
          <Link to="/login" className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-bold text-lg shadow hover:bg-indigo-100 transition">Get Started</Link>
          <a href="#features" className="px-8 py-3 rounded-lg border border-white font-bold text-lg hover:bg-white hover:text-indigo-600 transition">Learn More</a>
        </div>
      </main>
      <section id="features" className="py-16 bg-white text-indigo-700">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-4 gap-10">
            <div className="bg-indigo-50 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">Virtual Portfolio</h3>
              <p>Build and manage your own stock portfolio. Track your performance over time—no real money required.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">Wishlist</h3>
              <p>Add interesting stocks to your wishlist and monitor their trends for future opportunities.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">Transactions</h3>
              <p>View and manage your stock transactions with ease. Keep track of your buying and selling activity.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">Safe Paper Trading</h3>
              <p>Experience the excitement of trading and learning the market, all in a risk-free environment.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-6 text-center text-indigo-100 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400">
        &copy; {new Date().getFullYear()} Stoxy. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
