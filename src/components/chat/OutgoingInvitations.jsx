import React from 'react';
import { Send, Clock, Check, X, AlertCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const OutgoingInvitations = () => {
  const { roomInvitations } = useChat();
  const { user } = useAuth();

  if (!user) return null;

  const outgoingInvitations = roomInvitations.filter(
    invitation => invitation.inviterUserId === user.id
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accept':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'reject':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accept':
        return 'Accepted';
      case 'reject':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-200 bg-yellow-500/20';
      case 'accept':
        return 'text-green-200 bg-green-500/20';
      case 'reject':
        return 'text-red-200 bg-red-500/20';
      default:
        return 'text-gray-200 bg-gray-500/20';
    }
  };

  if (outgoingInvitations.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-white/20">
      <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center space-x-2">
        <Send className="w-4 h-4" />
        <span>Sent Invitations ({outgoingInvitations.length})</span>
      </h4>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {outgoingInvitations.map(invitation => (
          <div key={invitation.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-white text-sm">
                  Invited <span className="font-medium">{invitation.invitedUsername}</span>
                </p>
                <p className="text-blue-200 font-medium text-sm">{invitation.roomName}</p>
              </div>
              <div className="flex items-center text-white/60 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(invitation.timestamp).toLocaleDateString()}
              </div>
            </div>
            
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(invitation.status)}`}>
              {getStatusIcon(invitation.status)}
              <span>{getStatusText(invitation.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutgoingInvitations;