import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { roomsAPI, messagesAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROOMS':
      return {
        ...state,
        rooms: action.payload,
      };
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: [...(state.messages[action.payload.roomId] || []), action.payload.message],
        },
      };
    case 'SET_ACTIVE_ROOM':
      return {
        ...state,
        activeRoom: action.payload,
      };
    case 'SET_ROOM_MEMBERS':
      return {
        ...state,
        roomMembers: {
          ...state.roomMembers,
          [action.payload.roomId]: action.payload.members,
        },
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, {
    rooms: [],
    messages: {},
    activeRoom: null,
    roomMembers: {},
  });

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      socketService.connect(token);
      loadRooms();

      // Listen for new messages
      socketService.onMessage((messageData) => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            roomId: messageData.roomId,
            message: messageData,
          },
        });
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [user, token]);

  // Join room when active room changes
  useEffect(() => {
    if (state.activeRoom) {
      socketService.joinRoom(state.activeRoom);
      loadMessages(state.activeRoom);
      loadRoomMembers(state.activeRoom);
    }
  }, [state.activeRoom]);

  // Load user's rooms
  const loadRooms = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await roomsAPI.getMyRooms();
      const rooms = response.data.map(room => ({
        id: room._id,
        name: room.name,
        description: room.description,
        createdBy: room.createdBy._id,
        createdAt: room.createdAt,
        members: room.members,
      }));
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    } catch (error) {
      console.error('Failed to load rooms:', error);
      toast.error('Failed to load rooms');
    }
  }, [user]);

  // Load messages for a room
  const loadMessages = useCallback(async (roomId) => {
    try {
      const response = await messagesAPI.getRoomMessages(roomId);
      dispatch({ 
        type: 'SET_MESSAGES', 
        payload: { roomId, messages: response.data } 
      });
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  }, []);

  // Load room members
  const loadRoomMembers = useCallback(async (roomId) => {
    try {
      const response = await roomsAPI.getRoomMembers(roomId);
      const members = response.data.map(member => ({
        id: member.user._id,
        username: member.user.username,
        avatar: member.user.avatar,
        bio: member.user.bio,
        role: member.role,
        joinedAt: member.joinedAt,
      }));
      dispatch({
        type: 'SET_ROOM_MEMBERS',
        payload: { roomId, members },
      });
    } catch (error) {
      console.error('Failed to load room members:', error);
    }
  }, []);

  const createRoom = useCallback(async (name, description) => {
    if (!user) return;

    try {
      const response = await roomsAPI.createRoom({ name, description });
      const room = {
        id: response.data.room._id,
        name: response.data.room.name,
        description: response.data.room.description,
        createdBy: response.data.room.createdBy._id,
        createdAt: response.data.room.createdAt,
        members: response.data.room.members,
      };
      dispatch({ type: 'ADD_ROOM', payload: room });
      toast.success('Room created successfully');
      
      // Auto-select the new room
      setActiveRoom(room.id);
    } catch (error) {
      console.error('Failed to create room:', error);
      toast.error(error.response?.data?.message || 'Failed to create room');
    }
  }, [user]);

  const sendMessage = useCallback(async (roomId, content, type = 'text') => {
    if (!user || !content.trim()) return;

    try {
      const response = await messagesAPI.sendMessage(roomId, { content: content.trim(), type });
      const message = {
        ...response.data,
        id: response.data._id,
        userId: response.data.sender._id,
        username: response.data.sender.username,
        avatar: response.data.sender.avatar,
        timestamp: response.data.createdAt,
      };
      
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { roomId, message } 
      });

      // Send via socket for real-time updates
      socketService.sendMessage({
        ...message,
        roomId,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  }, [user]);

  const sendJoinRequest = useCallback(async (roomId) => {
    if (!user) return { success: false, message: 'User not authenticated' };

    try {
      await roomsAPI.sendJoinRequest(roomId);
      toast.success('Join request sent successfully');
      return { success: true, message: 'Join request sent successfully' };
    } catch (error) {
      console.error('Failed to send join request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send join request';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  const inviteUser = useCallback(async (roomId, email) => {
    if (!user) return { success: false, message: 'User not authenticated' };

    try {
      await roomsAPI.inviteUser(roomId, email);
      toast.success('Invitation sent successfully');
      return { success: true, message: 'Invitation sent successfully' };
    } catch (error) {
      console.error('Failed to invite user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send invitation';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  const setActiveRoom = useCallback((roomId) => {
    if (state.activeRoom) {
      socketService.leaveRoom(state.activeRoom);
    }
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: roomId });
  }, [state.activeRoom]);

  const getRoomMembers = useCallback((roomId) => {
    return state.roomMembers[roomId] || [];
  }, [state.roomMembers]);

  const getAvailableRooms = useCallback(async (search = '') => {
    try {
      const response = await roomsAPI.getAvailableRooms(search);
      return response.data.map(room => ({
        _id: room._id,
        name: room.name,
        description: room.description,
        members: room.members,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load available rooms:', error);
      toast.error('Failed to load available rooms');
      return [];
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        createRoom,
        sendJoinRequest,
        sendMessage,
        setActiveRoom,
        getRoomMembers,
        getAvailableRooms,
        loadRooms,
        inviteUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};