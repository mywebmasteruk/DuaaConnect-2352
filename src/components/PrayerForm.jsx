import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const PrayerForm = ({ onPrayerAdded }) => {
  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prayer.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('prayers')
        .insert([
          {
            content: prayer.trim(),
            ameen_count: 0,
            is_published: true
          }
        ])
        .select();

      if (error) throw error;

      toast.success('Prayer shared successfully');
      setPrayer('');
      if (onPrayerAdded) onPrayerAdded(data[0]);
    } catch (error) {
      toast.error('Failed to share prayer');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="prayer"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Share Your Du'a
        </label>
        <textarea
          id="prayer"
          value={prayer}
          onChange={(e) => setPrayer(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          rows="4"
          placeholder="Type your prayer here (e.g., May Allah grant us peace and prosperity...)"
          maxLength="500"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {prayer.length}/500 characters
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !prayer.trim()}
        className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors
          ${(isSubmitting || !prayer.trim()) ? 'opacity-70 cursor-not-allowed' : 'shadow-md'}`}
      >
        <FaPaperPlane />
        {isSubmitting ? 'Sharing...' : 'Share Prayer'}
      </button>
    </motion.form>
  );
};

export default PrayerForm;