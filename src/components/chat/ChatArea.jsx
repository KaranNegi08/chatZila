import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, Palette, Smile } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import EnhancedMessageBubble from './EnhancedMessageBubble';
import RoomInfo from './RoomInfo';
import BackgroundSelector from './BackgroundSelector';
import FileUpload from './FileUpload';
import EmojiPicker from './EmojiPicker';

const ChatArea = () => {
  const { activeRoom, messages, sendMessage, rooms, getRoomMembers } = useChat();
  const { user } = useAuth();
  const { isDark, chatBackground } = useTheme();

  const [messageText, setMessageText] = useState('');
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);

  const currentRoom = rooms.find((room) => room.id === activeRoom);
  const currentMessages = activeRoom ? messages[activeRoom] || [] : [];
  const roomMembers = activeRoom ? getRoomMembers(activeRoom) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const getBackgroundStyle = () => {
    const base = isDark ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-gray-100';
    const styles = {
      'gradient-blue': isDark ? 'from-blue-900 to-indigo-900' : 'from-blue-50 to-indigo-100',
      'gradient-purple': isDark ? 'from-purple-900 to-pink-900' : 'from-purple-50 to-pink-100',
      'gradient-green': isDark ? 'from-green-900 to-emerald-900' : 'from-green-50 to-emerald-100',
      'solid-dark': 'from-gray-800 to-gray-800',
      'solid-light': 'from-white to-white',
    };
    return styles[chatBackground] || base;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !activeRoom) return;
    sendMessage(activeRoom, trimmed);
    setMessageText('');
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUploaded = (fileMessage) => {
    // Files handled in FileUpload component via API
  };

  const renderEmptyState = () => (
    <div className={`flex-1 flex items-center justify-center bg-gradient-to-br ${getBackgroundStyle()}`}>
      <div className="text-center">
        <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <h3 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome to ChatApp
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          Select a room to start chatting or create a new one
        </p>
      </div>
    </div>
  );

  if (!activeRoom || !currentRoom) return renderEmptyState();

  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {currentRoom.name}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {roomMembers.length} members
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBackgroundSelector(true)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Background</span>
            </button>
            <button
              onClick={() => setShowRoomInfo(true)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Room Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br ${getBackgroundStyle()}`}>
  {currentMessages.map((msg) => (
  <EnhancedMessageBubble
    key={msg._id}
    message={msg}
    isOwn={msg.sender?._id === user?._id}
    currentUser={user}
  />
))}
  <div ref={messagesEndRef} />
</div>

      {/* Message Input */}
      <div className={`border-t p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <FileUpload roomId={activeRoom} onFileUploaded={handleFileUploaded} disabled={!activeRoom} />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
          </div>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Modals */}
      <RoomInfo isOpen={showRoomInfo} onClose={() => setShowRoomInfo(false)} room={currentRoom} members={roomMembers} />
      <BackgroundSelector isOpen={showBackgroundSelector} onClose={() => setShowBackgroundSelector(false)} />
    </div>
  );
};

export default ChatArea;
