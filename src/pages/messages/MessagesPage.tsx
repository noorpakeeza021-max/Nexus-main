import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversationsForUser } from '../../data/messages';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { MessageCircle, Search, ArrowLeft } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  if (!user) return null;
  
  const conversations = getConversationsForUser(user.id).filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm sm:text-base text-gray-600">Chat with your connections</p>
        </div>
      </div>

      {/* Search - Mobile */}
      <div className="relative sm:hidden">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {conversations.length > 0 ? (
          <div className="h-full flex flex-col sm:flex-row">
            {/* Mobile: Single list */}
            <div className="flex-1 overflow-y-auto">
              <ChatUserList conversations={conversations} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="bg-gray-100 p-4 sm:p-6 rounded-full mb-4">
              <MessageCircle size={24} className="sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 text-center">No messages yet</h2>
            <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
              Start connecting with entrepreneurs and investors
            </p>
            <button
              onClick={() => navigate('/investors')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Find Connections
            </button>
          </div>
        )}
      </div>
    </div>
  );
};