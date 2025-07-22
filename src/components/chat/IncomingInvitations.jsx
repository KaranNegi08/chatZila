import React from 'react';
import { Mail, Check, X, Clock } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const IncomingInvitations = () => {
  const { roomInvitations, handleRoomInvitation } = useChat();
  const { user } = useAuth();

  if (!user) return null;

  const incomingInvitations = roomInvitations.filter(
    invitation => invitation.invitedUserId === user.id && invitation.status === 'pending'
  );

  if (incomingInvitations.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-white/20">
      <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center space-x-2">
        <Mail className="w-4 h-4" />
        <span>Room Invitations ({incomingInvitations.length})</span>
      </h4>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {incomingInvitations.map(invitation => (
          <div key={invitation.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-white text-sm">
                  <span className="font-medium">{invitation.inviterUsername}</span> invited you to join
                </p>
                <p className="text-blue-200 font-medium text-sm">{invitation.roomName}</p>
              </div>
              <div className="flex items-center text-white/60 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(invitation.timestamp).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleRoomInvitation(invitation.id, 'accept')}
                className="flex-1 bg-green-500/20 text-green-200 px-3 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-1"
              >
                <Check className="w-3 h-3" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleRoomInvitation(invitation.id, 'reject')}
                className="flex-1 bg-red-500/20 text-red-200 px-3 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingInvitations;