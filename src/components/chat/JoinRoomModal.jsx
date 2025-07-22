import React, { useState } from 'react';
import { X, Hash, Search, Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const JoinRoomModal = ({ isOpen, onClose }) => {
  const { sendJoinRequest, getAvailableRooms } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  React.useEffect(() => {
    if (isOpen) {
      loadAvailableRooms();
    }
  }, [isOpen]);

  const loadAvailableRooms = async () => {
    setLoading(true);
    try {
      const rooms = await getAvailableRooms(searchTerm);
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Failed to load available rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadAvailableRooms();
  };

  const handleSendJoinRequest = async (roomId) => {
    const result = await sendJoinRequest(roomId);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
        setMessage({ type: '', text: '' });
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleClose = () => {
    setMessage({ type: '', text: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Request to Join Room</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search for rooms to request joining..."
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-2">Loading rooms...</p>
              </div>
            ) : availableRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Hash className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No rooms available to request joining</p>
              </div>
            ) : (
              availableRooms.map(room => (
                <div key={room._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{room.name}</h3>
                    {room.description && (
                      <p className="text-sm text-gray-600">{room.description}</p>
                    )}
                    <p className="text-xs text-gray-500">{room.members?.length || 0} members</p>
                  </div>
                  <button
                    onClick={() => handleSendJoinRequest(room._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Request</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;