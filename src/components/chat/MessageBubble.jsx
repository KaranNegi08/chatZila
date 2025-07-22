import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust this path

const MessageBubble = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  // 🔍 Safely compare sender ID and current user ID
  const isCurrentUser = currentUser?._id?.toString() === message?.sender?._id?.toString();

  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        
        {/* Avatar */}
        <img
          src={message?.sender?.avatar || '/default-avatar.png'}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        />

        <div>
          {/* Sender Name */}
          <p className="text-xs font-medium text-gray-700 mb-1">{message?.sender?.name}</p>

          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-xl shadow-sm ${
              isCurrentUser
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 text-black rounded-bl-none'
            }`}
          >
            {message?.content}
          </div>

          {/* Timestamp */}
          <p className="text-[10px] text-gray-500 mt-1">
            {new Date(message?.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
