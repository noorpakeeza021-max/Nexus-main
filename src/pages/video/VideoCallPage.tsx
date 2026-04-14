import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Maximize2, Minimize2, Settings, Users, MessageSquare, Monitor, Hand, FileText, MoreVertical, Send, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface VideoCallPageProps {
  meetingId?: string;
  meetingLink?: string;
}

export const VideoCallPage: React.FC<VideoCallPageProps> = ({ meetingId, meetingLink }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [raiseHand, setRaiseHand] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [participants] = useState<Participant[]>([
    { id: '1', name: 'You', isMuted: false, isVideoOff: false, isSpeaking: true, isScreenSharing: false },
    { id: '2', name: 'John Smith', isMuted: false, isVideoOff: false, isSpeaking: false, isScreenSharing: false },
    { id: '3', name: 'Sarah Johnson', isMuted: true, isVideoOff: false, isSpeaking: false, isScreenSharing: false },
    { id: '4', name: 'Mike Wilson', isMuted: false, isVideoOff: true, isSpeaking: false, isScreenSharing: false },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'John Smith', message: 'Hello everyone!', timestamp: new Date() },
    { id: '2', sender: 'Sarah Johnson', message: 'Hi! Ready to start?', timestamp: new Date() },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  useEffect(() => {
    if (isInCall && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Camera access denied:', err));
    }
  }, [isInCall]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinCall = async () => {
    setIsInCall(true);
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    setElapsedTime(0);
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now().toString(),
        sender: 'You',
        message: chatMessage,
        timestamp: new Date()
      }]);
      setChatMessage('');
    }
  };

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
      } catch (err) {
        console.log('Screen share cancelled');
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  if (!isInCall) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg">
          <CardBody className="text-center p-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video size={40} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Meeting</h2>
            <p className="text-gray-600 mb-6">
              {meetingLink ? meetingLink : 'Ready to join the meeting?'}
            </p>
            <div className="space-y-3">
              <Button className="w-full" leftIcon={<Video size={18} />} onClick={handleJoinCall}>
                Join Meeting
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">Nexus Meeting</h2>
          <span className="text-sm text-gray-400">ID: {meetingId || 'abc123'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-2 sm:p-4 grid grid-cols-2 gap-2 sm:gap-4">
          {participants.slice(0, 4).map((participant, index) => (
            <div
              key={participant.id}
              className={`relative bg-gray-800 rounded-xl overflow-hidden ${
                participant.name === 'You' ? 'ring-2 ring-primary-500' : ''
              } ${index === 0 && isVideoOn ? 'col-span-2 sm:col-span-1 sm:row-span-2' : ''}`}
            >
              {participant.isVideoOff ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-400">{participant.name[0]}</span>
                  </div>
                </div>
              ) : index === 0 && isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <span className="text-4xl font-bold text-gray-500">{participant.name[0]}</span>
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">{participant.name}</span>
                {participant.isMuted && <MicOff size={14} className="text-red-400" />}
                {participant.isScreenSharing && <Monitor size={14} className="text-blue-400" />}
              </div>
              
              {participant.isSpeaking && (
                <div className="absolute inset-0 ring-2 ring-green-500 rounded-xl"></div>
              )}
            </div>
          ))}
        </div>

        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Chat</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
                    msg.sender === 'You' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-200'
                  }`}>
                    <p className="text-xs text-gray-400 mb-1">{msg.sender}</p>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button size="sm" onClick={sendMessage}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {showParticipants && (
          <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Participants ({participants.length})</h3>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {participants.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">{p.name[0]}</span>
                    </div>
                    <span className="text-white text-sm">{p.name}</span>
                  </div>
                  <div className="flex gap-2">
                    {p.isMuted && <MicOff size={14} className="text-gray-400" />}
                    {p.isVideoOff && <VideoOff size={14} className="text-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showNotes && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Meeting Notes</h3>
              <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during the meeting..."
                className="w-full h-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 px-4 py-4">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isMicOn ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
          </button>
          
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isVideoOn ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
          </button>
          
          <button
            onClick={handleScreenShare}
            className={`p-4 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Monitor size={20} className="text-white" />
          </button>
          
          <button
            onClick={() => setRaiseHand(!raiseHand)}
            className={`p-4 rounded-full ${raiseHand ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Hand size={20} className="text-white" />
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full ${showChat ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <MessageSquare size={20} className="text-white" />
          </button>
          
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-4 rounded-full ${showParticipants ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Users size={20} className="text-white" />
          </button>
          
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-4 rounded-full ${showNotes ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <FileText size={20} className="text-white" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            {isFullscreen ? <Minimize2 size={20} className="text-white" /> : <Maximize2 size={20} className="text-white" />}
          </button>
          
          <button
            onClick={handleLeaveCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          >
            <Phone size={20} className="text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};