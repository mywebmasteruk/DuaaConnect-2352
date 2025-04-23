import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrayerForm from './components/PrayerForm';
import PrayerList from './components/PrayerList';
import AdminPanel from './components/AdminPanel';
import { FaMosque, FaUserShield } from 'react-icons/fa';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2">
                <FaMosque className="text-green-600 text-2xl" />
                <span className="text-xl font-bold text-green-600">Du'aShare</span>
              </Link>
              <div className="flex items-center">
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaUserShield />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <PrayerForm />
                  <div className="mt-8">
                    <PrayerList />
                  </div>
                </>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Du'aShare - Share your prayers with the community</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;