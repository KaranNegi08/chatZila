import React from 'react';
import { X, Crown, Calendar, Users, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import InviteMemberModal from './InviteMemberModal';

const RoomInfo = ({ isOpen, onClose, room, members }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [showInviteModal, setShowInviteModal] = React.useState(false);

  if (!isOpen || !room) return null;

  const isRoomCreator = room.createdBy === user?.id || room.createdBy === user?._id;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Room Information
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>

          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Invite Members</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {room.name}
              </h3>
              {room.description && (
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{room.description}</p>
              )}
            </div>

            <div className={`flex items-center space-x-4 text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{members.length} members</span>
              </span>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Members
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {members.map(member => (
                  <div key={member.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className={`w-10 h-10 rounded-full border-2 ${
                        isDark ? 'border-gray-600' : 'border-gray-200'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {member.username}
                        </p>
                        {member.id === room.createdBy && (
                          <Crown className="w-4 h-4 text-yellow-500" title="Room Creator" />
                        )}
                      </div>
                      {member.bio && (
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isRoomCreator && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">Room Creator</span>
                </div>
                <p className="text-sm text-blue-700">
                  You have full control over this room and can manage invitations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <InviteMemberModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        roomId={room?.id || room?._id} 
      />
    </>
  );
};

export default RoomInfo;