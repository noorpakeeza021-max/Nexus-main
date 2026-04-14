import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard, Menu, X, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface SettingsTab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const settingsTabs: SettingsTab[] = [
  { id: 'profile', name: 'Profile', icon: <User size={18} /> },
  { id: 'security', name: 'Security', icon: <Lock size={18} /> },
  { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
  { id: 'language', name: 'Language', icon: <Globe size={18} /> },
  { id: 'appearance', name: 'Appearance', icon: <Palette size={18} /> },
  { id: 'billing', name: 'Billing', icon: <CreditCard size={18} /> },
];

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account preferences</p>
        </div>
        
        <button
          className="lg:hidden p-2 bg-gray-100 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Settings navigation - Desktop */}
        <Card className="lg:col-span-1 hidden lg:block">
          <CardBody className="p-2">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </CardBody>
        </Card>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white pt-16 px-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{tab.icon}</span>
                    {tab.name}
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </nav>
            
            <Link to="/security" className="block mt-6">
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-gray-50 text-gray-700">
                <span className="mr-3"><Lock size={18} /></span>
                Full Security Settings
                <ChevronRight size={18} className="ml-auto" />
              </button>
            </Link>
          </div>
        )}

        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
              </CardHeader>
              <CardBody className="space-y-4 lg:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-2 text-sm text-gray-500">JPG, GIF or PNG. Max 800K</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <Input label="Full Name" defaultValue={user.name} />
                  <Input label="Email" type="email" defaultValue={user.email} />
                  <Input label="Role" value={user.role} disabled />
                  <Input label="Location" defaultValue="San Francisco, CA" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    rows={3}
                    defaultValue={user.bio}
                  ></textarea>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                  <Button className="w-full sm:w-auto">Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              </CardHeader>
              <CardBody className="space-y-4 lg:space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Add extra security to your account</p>
                      <span className="inline-block mt-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Not Enabled</span>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto">Enable</Button>
                  </div>
                </div>
                
                <div className="pt-4 lg:pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                  <div className="space-y-4">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <div className="flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive updates via email' },
                  { label: 'Push Notifications', desc: 'Browser push notifications' },
                  { label: 'Weekly Digest', desc: 'Weekly summary of activity' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {activeTab === 'language' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Language Settings</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Language</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+5.5 (India)</option>
                  </select>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Light', 'Dark', 'System'].map((theme) => (
                      <button key={theme} className={`p-4 border-2 rounded-lg text-sm font-medium ${
                        theme === 'Light' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}>{theme}</button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Billing & Plans</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <p className="text-sm text-primary-700">Current Plan</p>
                  <h3 className="text-xl font-bold text-primary-900">Free Tier</h3>
                  <Button size="sm" className="mt-3">Upgrade Plan</Button>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h3>
                  <p className="text-sm text-gray-500">No payment method added</p>
                  <Button variant="outline" size="sm" className="mt-2">Add Payment Method</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};