import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDark: !state.isDark,
      };
    case 'SET_CHAT_BACKGROUND':
      return {
        ...state,
        chatBackground: action.payload,
      };
    case 'LOAD_THEME':
      return action.payload;
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    isDark: false,
    chatBackground: 'default',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch({
        type: 'LOAD_THEME',
        payload: JSON.parse(savedTheme),
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(state));
    
    // Apply theme to document
    if (state.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setChatBackground = (background) => {
    dispatch({ type: 'SET_CHAT_BACKGROUND', payload: background });
  };

  return (
    <ThemeContext.Provider
      value={{
        ...state,
        toggleTheme,
        setChatBackground,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};