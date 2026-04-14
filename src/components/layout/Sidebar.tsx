import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Calendar, Video, 
  CreditCard, Shield, X, ChevronDown, ChevronUp, LogOut
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, onClick }) => {
  return onClick ? (
    <button onClick={onClick} className="flex items-center w-full py-2.5 px-4 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </button>
  ) : (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
          isActive 
            ? 'bg-primary-50 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('main');
  
  if (!user) return null;

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/meetings', icon: <Calendar size={20} />, text: 'Meetings' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Calls' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
    { to: '/payments', icon: <CreditCard size={20} />, text: 'Payments' },
    { to: '/security', icon: <Shield size={20} />, text: 'Security' },
  ];
  
  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/meetings', icon: <Calendar size={20} />, text: 'Meetings' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Calls' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
    { to: '/payments', icon: <CreditCard size={20} />, text: 'Payments' },
    { to: '/security', icon: <Shield size={20} />, text: 'Security' },
  ];
  
  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Desktop Sidebar
  const desktopSidebar = (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
            ))}
          </div>
          
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600">Need assistance?</p>
            <h4 className="text-sm font-medium text-gray-900 mt-1">Contact Support</h4>
            <a href="mailto:support@nexus.com" className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500">
              support@nexus.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const mobileSidebar = (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-primary-600">Nexus</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem 
                key={index} 
                to={item.to} 
                icon={item.icon} 
                text={item.text}
                onClick={onClose}
              />
            ))}
          </div>
          
          <div className="mt-6 px-3">
            <button 
              onClick={() => toggleSection('settings')}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase"
            >
              Settings
              {expandedSection === 'settings' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedSection === 'settings' && (
              <div className="mt-2 space-y-1">
                {commonItems.map((item, index) => (
                  <SidebarItem 
                    key={index} 
                    to={item.to} 
                    icon={item.icon} 
                    text={item.text}
                    onClick={onClose}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-error-600 hover:bg-error-50 rounded-md"
          >
            <LogOut size={20} className="mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};