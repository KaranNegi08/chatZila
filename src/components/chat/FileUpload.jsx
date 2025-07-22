import React, { useRef } from 'react';
import { Paperclip, Image, FileText } from 'lucide-react';
import { filesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FileUpload = ({ roomId, onFileUploaded, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const loadingToast = toast.loading('Uploading file...');
      const response = await filesAPI.uploadFile(roomId, formData);
      toast.dismiss(loadingToast);
      toast.success('File uploaded successfully');
      
      if (onFileUploaded) {
        onFileUploaded(response.data);
      }
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('File upload error:', error);
    }

    // Reset input
    event.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />
      
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload file or image"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </>
  );
};

export default FileUpload;