import React, { useState } from 'react';
import { Plus, Users, Settings, LogOut, MessageSquare, Send, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationPanel from '../notifications/NotificationPanel';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';
import ProfileModal from '../profile/ProfileModal';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { rooms, activeRoom, setActiveRoom } = useChat();
  const { isDark, toggleTheme } = useTheme();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) {
    return null; // Don't render if user is not available
  }

  return (
    <>
      <div className={`w-80 backdrop-blur-lg border-r flex flex-col h-full ${
        isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/10 border-white/20'
      }`}>
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-white/20'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={user.avatar}
              alt={user.username}
              className={`w-10 h-10 rounded-full border-2 ${
                isDark ? 'border-gray-600' : 'border-white/30'
              }`}
            />
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-white'}`}>
                {user.username}
              </h3>
              {user.bio && (
                <p className={`text-xs truncate max-w-[200px] ${
                  isDark ? 'text-gray-400' : 'text-white/70'
                }`}>
                  {user.bio}
                </p>
              )}
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-white/60'}`}>
                Online
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateRoom(true)}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                isDark 
                  ? 'bg-blue-600/30 text-blue-300 hover:bg-blue-600/40' 
                  : 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Create</span>
            </button>
            <button
              onClick={() => setShowJoinRoom(true)}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                isDark 
                  ? 'bg-orange-600/30 text-orange-300 hover:bg-orange-600/40' 
                  : 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="text-sm">Request</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h4 className={`text-sm font-medium mb-3 ${
            isDark ? 'text-gray-300' : 'text-white/80'
          }`}>
            Your Rooms
          </h4>
          <div className="space-y-2">
            {rooms.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-white/60'}`}>
                No rooms yet. Create or join one!
              </p>
            ) : (
              rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeRoom === room.id
                      ? isDark 
                        ? 'bg-blue-600/40 text-white' 
                        : 'bg-blue-500/30 text-white'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-800/50' 
                        : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{room.name}</p>
                    <p className="text-sm opacity-60 truncate">{room.members?.length || 0} members</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-white/20'}`}>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNotifications(true)}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </button>
            <button
              onClick={logout}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                isDark 
                  ? 'bg-red-600/30 text-red-300 hover:bg-red-600/40' 
                  : 'bg-red-500/20 text-red-200 hover:bg-red-500/30'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <CreateRoomModal isOpen={showCreateRoom} onClose={() => setShowCreateRoom(false)} />
      <JoinRoomModal isOpen={showJoinRoom} onClose={() => setShowJoinRoom(false)} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default Sidebar;