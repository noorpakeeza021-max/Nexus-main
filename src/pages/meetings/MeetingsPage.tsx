import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Users, Plus, X, ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
}

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Pitch Review with Investor',
    date: '2024-02-20',
    time: '10:00',
    duration: 60,
    type: 'video',
    participants: ['John Smith', 'Sarah Johnson'],
    status: 'scheduled',
    meetingLink: 'https://meet.nexus.app/abc123'
  },
  {
    id: '2',
    title: 'Business Strategy Session',
    date: '2024-02-21',
    time: '14:00',
    duration: 90,
    type: 'in-person',
    participants: ['Mike Wilson', 'Emily Brown'],
    status: 'scheduled',
    location: 'Nexus Hub, Conference Room A'
  },
  {
    id: '3',
    title: 'Q1 Financial Review',
    date: '2024-02-22',
    time: '11:00',
    duration: 45,
    type: 'video',
    participants: ['David Lee', 'Anna Taylor'],
    status: 'scheduled',
    meetingLink: 'https://meet.nexus.app/xyz789'
  },
  {
    id: '4',
    title: 'Product Demo',
    date: '2024-02-23',
    time: '15:00',
    duration: 60,
    type: 'video',
    participants: ['Tech Team'],
    status: 'scheduled',
    meetingLink: 'https://meet.nexus.app/demo456'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1));
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    time: '10:00',
    duration: 60,
    type: 'video',
    participants: [],
    status: 'scheduled'
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getMeetingsForDate = (dateStr: string) => {
    return meetings.filter(m => m.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(formatDate(day));
    setShowModal(true);
  };

  const handleCreateMeeting = () => {
    if (newMeeting.title && selectedDate) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title || '',
        date: selectedDate,
        time: newMeeting.time || '10:00',
        duration: newMeeting.duration || 60,
        type: newMeeting.type as 'video' | 'in-person',
        participants: newMeeting.participants as string[] || [],
        status: 'scheduled',
        meetingLink: newMeeting.type === 'video' ? `https://meet.nexus.app/${Math.random().toString(36).substr(2, 6)}` : undefined,
        location: newMeeting.type === 'in-person' ? newMeeting.location : undefined
      };
      setMeetings([...meetings, meeting]);
      setShowModal(false);
      setNewMeeting({ title: '', time: '10:00', duration: 60, type: 'video', participants: [], status: 'scheduled' });
    }
  };

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(meetings.map(m => m.id === meetingId ? { ...m, status: 'cancelled' as const } : m));
  };

  const joinMeeting = (link: string) => {
    window.open(link, '_blank');
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600">Schedule and manage your meetings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold min-w-[160px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Today</Button>
                <Button leftIcon={<Plus size={16} />} onClick={() => setShowModal(true)}>New Meeting</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  const dateStr = day ? formatDate(day) : '';
                  const dayMeetings = day ? getMeetingsForDate(dateStr) : [];
                  const isToday = day && dateStr === '2024-02-20';
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] sm:min-h-[100px] p-1 border border-gray-100 rounded-lg ${
                        day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                      } ${isToday ? 'bg-primary-50 border-primary-200' : ''}`}
                      onClick={() => day && handleDateClick(day)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                            {day}
                          </div>
                          {dayMeetings.slice(0, 2).map(meeting => (
                            <div
                              key={meeting.id}
                              className={`text-xs px-1 py-0.5 mt-1 rounded truncate ${
                                meeting.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {meeting.time}
                            </div>
                          ))}
                          {dayMeetings.length > 2 && (
                            <div className="text-xs text-gray-500 mt-1">+{dayMeetings.length - 2} more</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {meetings.filter(m => m.status === 'scheduled').slice(0, 5).map(meeting => (
                <div key={meeting.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{meeting.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarIcon size={12} />
                        <span>{meeting.date} at {meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{meeting.duration} min</span>
                      </div>
                    </div>
                    <Badge variant={meeting.type === 'video' ? 'primary' : 'secondary'}>
                      {meeting.type === 'video' ? <Video size={12} className="mr-1" /> : <MapPin size={12} className="mr-1" />}
                      {meeting.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{meeting.participants.join(', ')}</span>
                  </div>
                  {meeting.type === 'video' && meeting.meetingLink && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      leftIcon={<Video size={14} />}
                      onClick={() => joinMeeting(meeting.meetingLink!)}
                    >
                      Join Meeting
                    </Button>
                  )}
                  {meeting.type === 'in-person' && meeting.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                      <MapPin size={12} />
                      {meeting.location}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-error-600"
                    onClick={() => handleCancelMeeting(meeting.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
              {meetings.filter(m => m.status === 'scheduled').length === 0 && (
                <p className="text-center text-gray-500 py-4">No upcoming meetings</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Meeting Title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                placeholder="Enter meeting title"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="p-2 border border-gray-300 rounded-lg bg-gray-50">
                  {selectedDate}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newMeeting.type === 'video'}
                      onChange={() => setNewMeeting({ ...newMeeting, type: 'video' })}
                      className="mr-2"
                    />
                    <Video size={16} className="mr-1" />
                    Video Call
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newMeeting.type === 'in-person'}
                      onChange={() => setNewMeeting({ ...newMeeting, type: 'in-person' })}
                      className="mr-2"
                    />
                    <MapPin size={16} className="mr-1" />
                    In-Person
                  </label>
                </div>
              </div>
              
              {newMeeting.type === 'in-person' && (
                <Input
                  label="Location"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  placeholder="Enter location"
                />
              )}
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateMeeting}>Schedule</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};