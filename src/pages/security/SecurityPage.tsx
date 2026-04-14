import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Key, Smartphone, Fingerprint, Mail, AlertTriangle, Check, X, Clock, History, LogIn, Users, Globe, Bell, AlertCircle, Home, HardDrive, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface SecurityLog {
  id: string;
  action: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
}

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
}

const securityLogs: SecurityLog[] = [
  { id: '1', action: 'Login successful', device: 'Chrome - Windows', location: 'New York, US', ip: '192.168.1.100', timestamp: '2024-02-20 10:30 AM' },
  { id: '2', action: 'Password changed', device: 'Chrome - Windows', location: 'New York, US', ip: '192.168.1.100', timestamp: '2024-02-19 3:45 PM' },
  { id: '3', action: 'Login successful', device: 'Safari - iPhone', location: 'New York, US', ip: '192.168.1.105', timestamp: '2024-02-18 9:15 AM' },
  { id: '4', action: 'Failed login attempt', device: 'Unknown', location: 'Mumbai, IN', ip: '103.25.43.12', timestamp: '2024-02-17 11:20 PM' },
  { id: '5', action: 'Two-factor authentication enabled', device: 'Chrome - Windows', location: 'New York, US', ip: '192.168.1.100', timestamp: '2024-02-16 2:00 PM' },
];

const sessions: Session[] = [
  { id: '1', device: 'Chrome - Windows', location: 'New York, US', ip: '192.168.1.100', lastActive: 'Active now', current: true },
  { id: '2', device: 'Safari - iPhone', location: 'New York, US', ip: '192.168.1.105', lastActive: '2 hours ago', current: false },
  { id: '3', device: 'Mobile App - Android', location: 'New York, US', ip: '192.168.1.110', lastActive: '1 day ago', current: false },
];

const trustedDevices: TrustedDevice[] = [
  { id: '1', name: 'MacBook Pro', type: 'laptop', lastUsed: '2024-02-20' },
  { id: '2', name: 'iPhone 14', type: 'mobile', lastUsed: '2024-02-18' },
  { id: '3', name: 'Dell XPS', type: 'desktop', lastUsed: '2024-02-15' },
];

export const SecurityPage: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2faModal, setShow2faModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    setPasswordChanged(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordChanged(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  const handleTerminateSession = (sessionId: string) => {
    console.log('Terminating session:', sessionId);
  };

  const handleRemoveDevice = (deviceId: string) => {
    console.log('Removing device:', deviceId);
  };

  const getActionBadge = (action: string) => {
    if (action.includes('successful') || action.includes('enabled')) {
      return <Badge variant="success">{action}</Badge>;
    } else if (action.includes('Failed')) {
      return <Badge variant="error">{action}</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  const securityScore = 85;
  const weakPassword = newPassword.length < 8;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-600">Manage your account security and privacy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Security Score</p>
                <h3 className="text-2xl font-bold text-green-900">{securityScore}%</h3>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <Shield size={24} className="text-green-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">2FA Status</p>
                <h3 className="text-xl font-bold text-blue-900">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</h3>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Fingerprint size={24} className="text-blue-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Active Sessions</p>
                <h3 className="text-2xl font-bold text-purple-900">{sessions.length}</h3>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Globe size={24} className="text-purple-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Trusted Devices</p>
                <h3 className="text-2xl font-bold text-orange-900">{trustedDevices.length}</h3>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Smartphone size={24} className="text-orange-700" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Password & Authentication</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Lock size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Smartphone size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled ? (
                    <Badge variant="success">Enabled</Badge>
                  ) : (
                    <Badge variant="warning">Disabled</Badge>
                  )}
                  <Button variant="outline" onClick={() => setShow2faModal(true)}>
                    {twoFactorEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Key size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Recovery Codes</h3>
                    <p className="text-sm text-gray-500">Access your account if you lose your device</p>
                  </div>
                </div>
                <Button variant="outline">View Codes</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Active Sessions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${session.current ? 'bg-primary-100' : 'bg-gray-100'}`}>
                        <LogIn size={20} className={session.current ? 'text-primary-600' : 'text-gray-600'} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{session.device}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{session.location}</span>
                          <span>•</span>
                          <span>{session.ip}</span>
                          <span>•</span>
                          <span>{session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && <Badge variant="primary">Current</Badge>}
                      {!session.current && (
                        <Button variant="ghost" size="sm" onClick={() => handleTerminateSession(session.id)}>
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Security Activity Log</h2>
              <Button variant="outline" size="sm" leftIcon={<History size={16} />}>
                View All
              </Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {securityLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className={log.action.includes('Failed') ? 'text-error-600' : 'text-gray-400'} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getActionBadge(log.action)}</p>
                        <p className="text-xs text-gray-500">{log.device} • {log.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                      <p className="text-xs text-gray-400">{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive security alerts via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Login Alerts</p>
                    <p className="text-xs text-gray-500">Get notified of new logins</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Trusted Devices</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {trustedDevices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{device.name}</p>
                        <p className="text-xs text-gray-500">Last used: {device.lastUsed}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveDevice(device.id)}>
                      <Trash2 size={16} className="text-error-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Add New Device</Button>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-200 rounded-full">
                  <HardDrive size={24} className="text-red-700" />
                </div>
                <div>
                  <h3 className="font-medium text-red-900">Danger Zone</h3>
                  <p className="text-sm text-red-700">Permanently delete your account</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-white text-red-600 border-red-300 hover:bg-red-50">
                Delete Account
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {passwordChanged ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Password Changed!</h3>
                <p className="text-gray-600 mt-2">Your password has been updated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPassword && weakPassword && (
                    <p className="text-xs text-error-600 mt-1">Password must be at least 8 characters</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-error-600 mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handlePasswordChange}
                  disabled={!currentPassword || !newPassword || !confirmPassword || weakPassword || newPassword !== confirmPassword}
                >
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {show2faModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
              <button onClick={() => setShow2faModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint size={40} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {twoFactorEnabled ? '2FA is Enabled' : 'Enable Two-Factor Authentication'}
              </h3>
              <p className="text-gray-600 mt-2 mb-6">
                {twoFactorEnabled
                  ? 'Your account is protected with 2FA'
                  : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
              </p>
              <div className="space-y-3">
                {twoFactorEnabled ? (
                  <Button variant="outline" onClick={() => setTwoFactorEnabled(false)} className="w-full">
                    Disable 2FA
                  </Button>
                ) : (
                  <Button onClick={() => setTwoFactorEnabled(true)} className="w-full">
                    Enable 2FA
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setShow2faModal(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};