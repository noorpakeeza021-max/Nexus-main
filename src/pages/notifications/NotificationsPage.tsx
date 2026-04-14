import React from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign, Check, Trash2, Filter } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const notifications = [
  {
    id: 1,
    type: 'message',
    user: { name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
    content: 'sent you a message about your startup',
    time: '5 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'connection',
    user: { name: 'Michael Rodriguez', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
    content: 'accepted your connection request',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 3,
    type: 'investment',
    user: { name: 'Jennifer Lee', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg' },
    content: 'showed interest in investing in your startup',
    time: '1 day ago',
    unread: false
  }
];

export const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle size={16} className="text-primary-600" />;
      case 'connection': return <UserPlus size={16} className="text-secondary-600" />;
      case 'investment': return <DollarSign size={16} className="text-accent-600" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.unread) 
    : notifications;

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm sm:text-base text-gray-600">Stay updated with your network</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Check size={16} className="mr-1" /> Mark all read
          </Button>
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      {/* Filter tabs - Mobile */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Unread
        </button>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {filteredNotifications.map(notification => (
          <Card
            key={notification.id}
            className={`transition-colors duration-200 ${
              notification.unread ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
            }`}
          >
            <CardBody className="flex items-start p-3 sm:p-4">
              <Avatar
                src={notification.user.avatar}
                alt={notification.user.name}
                size="md"
                className="flex-shrink-0 mr-3"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {notification.user.name}
                  </span>
                  {notification.unread && (
                    <Badge variant="primary" size="sm">New</Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mt-1 text-sm">
                  {notification.content}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                  {getNotificationIcon(notification.type)}
                  <span>{notification.time}</span>
                </div>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <Trash2 size={16} />
              </button>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No notifications</p>
        </div>
      )}
    </div>
  );
};