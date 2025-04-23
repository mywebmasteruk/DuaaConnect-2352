import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { FaHeart, FaPray } from 'react-icons/fa';

const PrayerList = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
    
    const subscription = supabase
      .channel('prayers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, handleChange)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setPrayers(current => [payload.new, ...current]);
    } else if (payload.eventType === 'UPDATE') {
      setPrayers(current =>
        current.map(prayer =>
          prayer.id === payload.new.id ? payload.new : prayer
        )
      );
    } else if (payload.eventType === 'DELETE') {
      setPrayers(current =>
        current.filter(prayer => prayer.id !== payload.old.id)
      );
    }
  };

  const fetchPrayers = async () => {
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('is_published', true)
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

  const handleAmeen = async (prayerId, currentCount) => {
    try {
      const { error } = await supabase
        .from('prayers')
        .update({ ameen_count: currentCount + 1 })
        .eq('id', prayerId);

      if (error) throw error;
      toast.success('Ameen recorded - May Allah accept our prayers');
    } catch (error) {
      toast.error('Failed to record Ameen');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <FaPray className="mx-auto text-4xl text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No prayers yet</h3>
          <p className="text-gray-500">Be the first to share a prayer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prayers.map((prayer, index) => (
        <motion.div
          key={prayer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <p className="text-gray-800 mb-4 leading-relaxed">{prayer.content}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
            </span>
            <button
              onClick={() => handleAmeen(prayer.id, prayer.ameen_count)}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors group"
            >
              <FaHeart className="text-green-500 group-hover:scale-110 transition-transform" />
              <span>Ameen ({prayer.ameen_count})</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PrayerList;