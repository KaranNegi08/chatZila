import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AuthPage = () => {
  const { isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.username, formData.email, formData.password);
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Email already exists or registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800'
    }`}>
      <div className={`backdrop-blur-lg rounded-2xl shadow-2xl border p-8 w-full max-w-md ${
        isDark 
          ? 'bg-gray-800/90 border-gray-600' 
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-gray-700' : 'bg-white/20'
          }`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join ChatAI'}
          </h1>
          <p className="text-white/80">
            {isLogin ? 'Sign in to continue chatting' : 'Create your account to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600 placeholder-gray-400' 
                    : 'bg-white/10 border-white/20 placeholder-white/60'
                }`}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 placeholder-gray-400' 
                  : 'bg-white/10 border-white/20 placeholder-white/60'
              }`}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 placeholder-gray-400' 
                  : 'bg-white/10 border-white/20 placeholder-white/60'
              }`}
            />
          </div>

          {error && (
            <div className={`border rounded-lg p-3 text-sm ${
              isDark 
                ? 'bg-red-900/30 border-red-700 text-red-300' 
                : 'bg-red-500/20 border-red-400/50 text-red-200'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;