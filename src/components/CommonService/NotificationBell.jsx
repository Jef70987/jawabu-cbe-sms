// src/components/common/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useNotifications } from '../../Context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = ({ portal = 'teacher' }) => {
  const { unreadCount, loading, fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = () => {
    // Navigate to appropriate notification page based on portal
    navigate(`/${portal}/notifications`);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Bell className={`h-5 w-5 ${isHovered ? 'text-green-600' : 'text-gray-600'}`} />
      
      {!loading && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      
      {loading && (
        <span className="absolute -top-1 -right-1">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </span>
      )}
    </button>
  );
};