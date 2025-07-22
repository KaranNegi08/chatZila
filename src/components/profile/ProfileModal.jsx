import React, { useState, useRef } from 'react';
import { X, Camera, Save, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [imagePreview, setImagePreview] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      avatar: imagePreview
    });
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setImagePreview(imageDataUrl);
        setFormData({ ...formData, avatar: imageDataUrl });
        setUploading(false);
      };
      
      reader.onerror = () => {
        alert('Error reading file');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const generateNewAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36)}`;
    setImagePreview(newAvatar);
    setFormData({ ...formData, avatar: newAvatar });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`;
                }}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
              
              <button
                type="button"
                onClick={generateNewAvatar}
                disabled={uploading}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Generate</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              Upload a photo from your device or generate a random avatar
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{uploading ? 'Processing...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;