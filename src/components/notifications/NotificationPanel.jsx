import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Clock, UserPlus, MessageSquare, BookMarked as MarkAsRead } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleInvitationResponse = async (notificationId, action) => {
    try {
      await notificationsAPI.respondToInvitation(notificationId, action);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, actionTaken: action === 'accept' ? 'accepted' : 'declined', isRead: true }
            : notif
        )
      );
      toast.success(`Invitation ${action}ed successfully`);
      
      if (action === 'accept') {
        // Refresh the page to show new room
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Failed to ${action} invitation`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'room_invitation':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'join_request':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'message_mention':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Bell className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-800'}`} />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Mark all as read"
              >
                <MarkAsRead className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 transition-colors ${
                    !notification.isRead 
                      ? isDark 
                        ? 'bg-blue-900/20' 
                        : 'bg-blue-50'
                      : isDark 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-blue-500 hover:text-blue-600"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>

                      {/* Action buttons for invitations */}
                      {notification.type === 'room_invitation' && notification.actionTaken === 'pending' && (
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleInvitationResponse(notification._id, 'accept')}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleInvitationResponse(notification._id, 'decline')}
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {/* Status indicator for processed invitations */}
                      {notification.actionTaken !== 'pending' && notification.actionTaken !== 'none' && (
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs mt-2 ${
                          notification.actionTaken === 'accepted'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {notification.actionTaken === 'accepted' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span className="capitalize">{notification.actionTaken}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;