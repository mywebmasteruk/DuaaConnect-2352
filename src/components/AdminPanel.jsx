import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaLock, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';

const AdminPanel = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      setIsAuthenticated(adminAuth === 'true');
      if (adminAuth === 'true') {
        fetchAllPrayers();
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'YOUR_ADMIN_PASSWORD') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchAllPrayers();
      toast.success('Admin access granted');
    } else {
      toast.error('Invalid password');
    }
  };

  const fetchAllPrayers = async () => {
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayers(data);
    } catch (error) {
      toast.error('Failed to load prayers');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('prayers')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setPrayers(prayers.map(prayer =>
        prayer.id === id ? { ...prayer, is_published: !currentStatus } : prayer
      ));
      toast.success(`Prayer ${currentStatus ? 'unpublished' : 'published'}`);
    } catch (error) {
      toast.error('Action failed');
      console.error('Error:', error);
    }
  };

  const deletePrayer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prayer permanently?')) return;

    try {
      const { error } = await supabase
        .from('prayers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPrayers(prayers.filter(prayer => prayer.id !== id));
      toast.success('Prayer deleted permanently');
    } catch (error) {
      toast.error('Failed to delete prayer');
      console.error('Error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <FaLock className="mx-auto text-3xl text-green-500 mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
          <p className="text-gray-500 mt-1">Enter password to continue</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
              placeholder="Enter admin password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prayer Management</h2>
        <span className="text-sm text-gray-500">
          {prayers.length} {prayers.length === 1 ? 'prayer' : 'prayers'}
        </span>
      </div>
      
      <div className="space-y-4">
        {prayers.map((prayer) => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-lg border ${
              prayer.is_published ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'
            }`}
          >
            <p className="mb-3 text-gray-700">{prayer.content}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
                </span>
                <span className="mx-2">·</span>
                <span>{prayer.ameen_count} Ameen</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePublished(prayer.id, prayer.is_published)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                    prayer.is_published
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } transition-colors`}
                >
                  {prayer.is_published ? (
                    <>
                      <FaEyeSlash size={12} />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <FaEye size={12} />
                      <span>Show</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => deletePrayer(prayer.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <FaTrash size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;