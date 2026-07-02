import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTrash, FaCheckDouble, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { requestFirebaseToken, onMessageListener } from '../utils/firebase';
import { useSelector } from 'react-redux';
import ConfirmDialog from './ConfirmDialog';

const formatDistanceToNow = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' mins ago';
  if (seconds < 10) return 'Just now';
  return Math.floor(seconds) + ' secs ago';
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null });
  const dropdownRef = useRef(null);
  
  const { admin } = useSelector((state) => state.auth);
  
  const API_URL = process.env.REACT_APP_API_URL + '/notifications';
  
  const config = {
    headers: {
      Authorization: `Bearer ${admin?.token}`,
    },
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(API_URL, config);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const initFirebase = async () => {
    if (!admin?.token) return;
    try {
      const token = await requestFirebaseToken();
      if (token) {
        await axios.post(`${API_URL}/token`, { token }, config);
      }
    } catch (error) {
      console.error('Failed to initialize push notifications', error);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchNotifications();
      initFirebase();
      
      // Setup Firebase Listener
      const setupListener = async () => {
        try {
          while (true) {
            const payload = await onMessageListener();
            toast.info(
              <div>
                <strong>{payload.notification?.title}</strong>
                <p className="text-sm">{payload.notification?.body}</p>
              </div>,
              { icon: '🔔' }
            );
            fetchNotifications();
          }
        } catch (err) {
          console.log('Push listener failed: ', err);
        }
      };
      setupListener();

      // Polling Fallback (every 15 seconds)
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  // Click outside to close dropdown (ensure it doesn't close when confirm dialog is open)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (confirmDialog.isOpen) return; // Prevent closing if dialog is open
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [confirmDialog.isOpen]);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_URL}/${id}`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      const deletedNotif = notifications.find(n => n._id === id);
      setNotifications(notifications.filter(n => n._id !== id));
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    executeDelete(id);
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, config);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const executeDeleteAll = async () => {
    try {
      await axios.delete(API_URL, config);
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  const handleDeleteAllClick = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Notifications',
      message: 'Are you sure you want to delete all notifications? This action cannot be undone.',
      action: executeDeleteAll
    });
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors"
        >
          <FaBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-surface-2 animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-2 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h3 className="font-bold text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && <span className="bg-fire-gradient text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-accent hover:text-white transition-colors" title="Mark all as read">
                    <FaCheckDouble />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={handleDeleteAllClick} className="text-xs text-red-400 hover:text-red-300 transition-colors" title="Clear all">
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-text-secondary">
                  <FaBell className="mx-auto text-3xl mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors group ${!notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notification.read ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notification.createdAt))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{notification.message}</p>
                    
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button onClick={(e) => handleMarkAsRead(notification._id, e)} className="text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 transition-colors">
                          <FaCheck /> Read
                        </button>
                      )}
                      <button onClick={(e) => handleDeleteClick(notification._id, e)} className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </>
  );
};

export default NotificationBell;
