import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/chat/Sidebar';
import ChatArea from './components/chat/ChatArea';

const ChatLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex">
      <Sidebar />
      <ChatArea />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <ChatProvider>
                <ChatLayout />
              </ChatProvider>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;