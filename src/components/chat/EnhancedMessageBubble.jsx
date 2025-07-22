import React, { useState } from 'react';
import { User, Download, Image as ImageIcon, FileText, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { filesAPI, messagesAPI } from '../../services/api';
import EmojiPicker from './EmojiPicker';
import toast from 'react-hot-toast';

const EnhancedMessageBubble = ({ message, isOwn, currentUser }) => {
  const { isDark } = useTheme();
  const [showReactions, setShowReactions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleReaction = async (emoji) => {
    try {
      await messagesAPI.addReaction(message._id, emoji);
      toast.success('Reaction added');
    } catch {
      toast.error('Failed to add reaction');
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = filesAPI.getFileUrl(file.filename);
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = () => {
    const { file } = message;
    if (!file) return null;

    const fileUrl = filesAPI.getFileUrl(file.filename);

    if (message.type === 'image') {
      return (
        <div className="mt-2">
          {!imageError ? (
            <img
              src={fileUrl}
              alt={file.originalName}
              className="max-w-xs max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onError={() => setImageError(true)}
              onClick={() => window.open(fileUrl, '_blank')}
            />
          ) : (
            <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Image failed to load</span>
            </div>
          )}
        </div>
      );
    }

    if (message.type === 'file') {
      return (
        <div className="mt-2 flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-xs">
          <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {file.originalName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={() => handleDownload(file)}
            className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    const groupedReactions = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = acc[reaction.emoji] || [];
      acc[reaction.emoji].push(reaction);
      return acc;
    }, {});

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(groupedReactions).map(([emoji, reactions]) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
              reactions.some(r => r.user === currentUser?._id)
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{emoji}</span>
            <span>{reactions.length}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
          {message.sender?.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          <div
            className={`relative px-4 py-3 rounded-2xl shadow max-w-full group ${
              isOwn
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {!isOwn && (
              <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {message.sender?.username}
              </p>
            )}
            {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
            {renderFileContent()}

            {/* Emoji Picker */}
            <div
              className={`absolute top-1 ${isOwn ? 'left-1' : 'right-1'} opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                >
                  <MoreHorizontal className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
                {showReactions && (
                  <div className={`absolute top-full mt-1 z-10 ${isOwn ? 'left-0' : 'right-0'}`}>
                    <EmojiPicker
                      onEmojiSelect={(emoji) => {
                        handleReaction(emoji);
                        setShowReactions(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {renderReactions()}

          <span className={`text-xs mt-1 ${isOwn ? 'text-right' : 'text-left'} ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {new Date(message.createdAt || message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;
