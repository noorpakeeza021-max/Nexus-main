import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Phone, Video, Info, Smile, ArrowLeft, Menu, MoreVertical } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';
import { MessageCircle } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const chatPartner = userId ? findUserById(userId) : null;
  
  useEffect(() => {
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    }
  }, [currentUser, userId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !userId) return;
    
    const message = sendMessage({
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage
    });
    
    setMessages([...messages, message]);
    setNewMessage('');
    setConversations(getConversationsForUser(currentUser.id));
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="space-y-4 lg:space-y-0">
      <div className="lg:hidden mb-2">
        <button onClick={() => setShowSidebar(!showSidebar)} className="flex items-center text-sm text-primary-600">
          <Menu size={18} className="mr-1" />
          {showSidebar ? 'Hide' : 'Show'} contacts
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Conversations sidebar */}
        <div className={`w-full lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r border-gray-200 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
          <div className="p-3 lg:p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 hidden lg:block">Messages</h2>
          </div>
          <ChatUserList conversations={conversations} />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {chatPartner ? (
            <>
              {/* Chat header */}
              <div className="border-b border-gray-200 p-3 lg:p-4 flex justify-between items-center">
                <div className="flex items-center flex-1 min-w-0">
                  <Link to="/messages" className="lg:hidden mr-2">
                    <ArrowLeft size={20} />
                  </Link>
                  <Avatar
                    src={chatPartner.avatarUrl}
                    alt={chatPartner.name}
                    size="sm"
                    status={chatPartner.isOnline ? 'online' : 'offline'}
                    className="mr-2 lg:mr-3"
                  />
                  <div className="min-w-0">
                    <h2 className="text-sm lg:text-base font-medium text-gray-900 truncate">{chatPartner.name}</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {chatPartner.isOnline ? 'Online' : 'Last seen'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1 lg:space-x-2">
                  <Button variant="ghost" size="sm" className="rounded-full p-1.5 lg:p-2" aria-label="Voice">
                    <Phone size={16} lg:size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full p-1.5 lg:p-2" aria-label="Video">
                    <Video size={16} lg:size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full p-1.5 lg:p-2 hidden lg:flex" aria-label="Info">
                    <Info size={16} lg:size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-3 lg:p-4 overflow-y-auto bg-gray-50">
                {messages.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {messages.map(message => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === currentUser.id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3 lg:p-4 rounded-full mb-3 lg:mb-4">
                      <MessageCircle size={24} lg:size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-sm lg:text-base font-medium text-gray-700">No messages yet</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Send a message to start</p>
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="border-t border-gray-200 p-2 lg:p-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" className="rounded-full p-1.5 lg:p-2" aria-label="Emoji">
                    <Smile size={16} lg:size={20} />
                  </Button>
                  
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newMessage.trim()}
                    className="rounded-full p-2"
                    aria-label="Send"
                  >
                    <Send size={16} lg:size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="bg-gray-100 p-4 lg:p-6 rounded-full mb-4">
                <MessageCircle size={32} lg:size={48} className="text-gray-400" />
              </div>
              <h2 className="text-base lg:text-xl font-medium text-gray-700">Select a conversation</h2>
              <p className="text-sm text-gray-500 mt-2 text-center hidden lg:block">
                Choose a contact to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};