import { v4 as uuidv4 } from 'uuid';

export const meetings = new Map();

export const createMeeting = (meetingData) => {
  const meeting = {
    id: uuidv4(),
    ...meetingData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  meetings.set(meeting.id, meeting);
  return meeting;
};

export const findMeetingById = (id) => meetings.get(id);

export const findMeetingsByUser = (userId) => {
  return Array.from(meetings.values()).filter(
    m => m.organizerId === userId || m.participants.includes(userId)
  );
};

export const updateMeeting = (id, updates) => {
  const meeting = meetings.get(id);
  if (!meeting) return null;
  const updatedMeeting = { ...meeting, ...updates, updatedAt: new Date().toISOString() };
  meetings.set(id, updatedMeeting);
  return updatedMeeting;
};

export const deleteMeeting = (id) => meetings.delete(id);

export const seedMeetings = () => {
  const defaultMeetings = [
    { title: 'Pitch Review', date: '2024-02-20', time: '10:00', duration: 60, type: 'video', organizerId: '1', participants: ['1', '2'], status: 'scheduled', meetingLink: 'https://meet.nexus.app/abc123' },
    { title: 'Strategy Session', date: '2024-02-21', time: '14:00', duration: 90, type: 'in-person', organizerId: '1', participants: ['1', '3'], status: 'scheduled', location: 'Nexus Hub' },
  ];
  defaultMeetings.forEach(createMeeting);
};