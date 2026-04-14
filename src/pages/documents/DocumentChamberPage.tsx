import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, X, Eye, Edit3, Check, PenTool, Clock, Users, FileSignature, Search, Filter, Plus, MoreVertical, CheckCircle, AlertCircle, Send, Move, Type } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Signature {
  id: string;
  name: string;
  data: string;
  createdAt: string;
}

interface DocumentComment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  page?: number;
}

interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  changes: string;
}

interface Doc {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: 'draft' | 'pending_signature' | 'signed' | 'completed';
  signatures?: { name: string; signed: boolean; date?: string }[];
  versions?: DocumentVersion[];
  signedBy?: string[];
  signedAt?: string;
}

const initialDocs: Doc[] = [
  {
    id: '1',
    name: 'Investment Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    shared: true,
    status: 'pending_signature',
    signatures: [
      { name: 'John Smith', signed: false },
      { name: 'Sarah Johnson', signed: true, date: '2024-02-14' }
    ],
    signedBy: ['Sarah Johnson'],
    versions: [
      { id: '1', version: 1, uploadedBy: 'John Smith', uploadedAt: '2024-02-10', changes: 'Initial version' },
      { id: '2', version: 2, uploadedBy: 'Sarah Johnson', uploadedAt: '2024-02-14', changes: 'Added signature fields' }
    ]
  },
  {
    id: '2',
    name: 'NDA - Tech Corp.pdf',
    type: 'PDF',
    size: '1.2 MB',
    lastModified: '2024-02-12',
    shared: true,
    status: 'signed',
    signatures: [
      { name: 'Mike Wilson', signed: true, date: '2024-02-12' },
      { name: 'Emily Brown', signed: true, date: '2024-02-12' }
    ],
    signedBy: ['Mike Wilson', 'Emily Brown'],
    signedAt: '2024-02-12'
  },
  {
    id: '3',
    name: 'Partnership Agreement.pdf',
    type: 'PDF',
    size: '3.1 MB',
    lastModified: '2024-02-18',
    shared: false,
    status: 'draft',
    versions: [
      { id: '1', version: 1, uploadedBy: 'You', uploadedAt: '2024-02-18', changes: 'Initial draft' }
    ]
  },
  {
    id: '4',
    name: 'Service Contract.pdf',
    type: 'PDF',
    size: '1.8 MB',
    lastModified: '2024-02-08',
    shared: true,
    status: 'completed',
    signedBy: ['David Lee', 'Anna Taylor'],
    signedAt: '2024-02-08'
  }
];

export const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<Doc[]>(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<Signature[]>([
    { id: '1', name: 'My Signature', data: 'John Smith', createdAt: '2024-01-15' }
  ]);
  const [newSignature, setNewSignature] = useState('');
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [documentNotes, setDocumentNotes] = useState<{ [key: string]: string }>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getStatusBadge = (status: Doc['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'pending_signature':
        return <Badge variant="warning">Pending Signature</Badge>;
      case 'signed':
        return <Badge variant="primary">Signed</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteDoc = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
      setShowViewer(false);
    }
  };

  const handleSaveSignature = () => {
    if (newSignature.trim()) {
      setSavedSignatures([...savedSignatures, {
        id: Date.now().toString(),
        name: 'Signature',
        data: newSignature,
        createdAt: new Date().toISOString().split('T')[0]
      }]);
      setNewSignature('');
    }
  };

  const handleSignDocument = (docId: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === docId && doc.signatures) {
        const updatedSignatures = doc.signatures.map(s => 
          s.name === 'You' ? { ...s, signed: true, date: new Date().toISOString().split('T')[0] } : s
        );
        const allSigned = updatedSignatures.every(s => s.signed);
        return {
          ...doc,
          signatures: updatedSignatures,
          status: allSigned ? 'completed' as const : 'signed' as const,
          signedAt: allSigned ? new Date().toISOString().split('T')[0] : undefined,
          signedBy: allSigned ? [...(doc.signedBy || []), 'You'] : doc.signedBy
        };
      }
      return doc;
    }));
    setShowSignatureModal(false);
  };

  const openDocument = (doc: Doc) => {
    setSelectedDoc(doc);
    setShowViewer(true);
  };

  const addComment = () => {
    if (newComment.trim() && selectedDoc) {
      setComments([...comments, {
        id: Date.now().toString(),
        user: 'You',
        text: newComment,
        timestamp: new Date().toISOString(),
        page: 1
      }]);
      setNewComment('');
    }
  };

  const getCompletionPercentage = (doc: Doc) => {
    if (!doc.signatures) return 0;
    const signed = doc.signatures.filter(s => s.signed).length;
    return Math.round((signed / doc.signatures.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Manage, sign, and share documents securely</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<FileSignature size={18} />} onClick={() => setShowSignatureModal(true)}>
            Add Signature
          </Button>
          <Button leftIcon={<Upload size={18} />}>
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_signature">Pending</option>
                  <option value="signed">Signed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                    onClick={() => openDocument(doc)}
                  >
                    <div className="p-3 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                      </div>
                      
                      {doc.signatures && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-primary-600 rounded-full" 
                                style={{ width: `${getCompletionPercentage(doc)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{getCompletionPercentage(doc)}% complete</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" aria-label="Download">
                        <Download size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Share">
                        <Share2 size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error-600"
                        aria-label="Delete"
                        onClick={(e) => { e.stopPropagation(); handleDeleteDoc(doc.id); }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No documents found</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Saved Signatures</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {savedSignatures.map(sig => (
                <div key={sig.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="text-lg font-serif italic text-gray-800">{sig.data}</div>
                  <p className="text-xs text-gray-500 mt-1">Created {sig.createdAt}</p>
                </div>
              ))}
              {savedSignatures.length === 0 && (
                <p className="text-center text-gray-500 py-4">No signatures saved</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Quick Stats</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Documents</span>
                <span className="font-semibold">{documents.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Signature</span>
                <span className="font-semibold text-warning-600">
                  {documents.filter(d => d.status === 'pending_signature').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Signed</span>
                <span className="font-semibold text-success-600">
                  {documents.filter(d => d.status === 'signed' || d.status === 'completed').length}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showViewer && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{selectedDoc.name}</h2>
                {getStatusBadge(selectedDoc.status)}
              </div>
              <button onClick={() => setShowViewer(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 bg-gray-100 p-8 overflow-auto">
                <div className="bg-white shadow-lg p-8 min-h-[800px] max-w-3xl mx-auto">
                  <h1 className="text-2xl font-bold mb-6">Document Preview</h1>
                  <p className="text-gray-600 mb-4">This is a preview of: {selectedDoc.name}</p>
                  
                  {selectedDoc.status !== 'draft' && selectedDoc.signatures && (
                    <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Signature Status</h3>
                      {selectedDoc.signatures.map((sig, idx) => (
                        <div key={idx} className="flex items-center gap-2 mt-2">
                          {sig.signed ? (
                            <CheckCircle size={16} className="text-success-600" />
                          ) : (
                            <AlertCircle size={16} className="text-warning-600" />
                          )}
                          <span>{sig.name}</span>
                          {sig.signed && <span className="text-xs text-gray-500">- Signed {sig.date}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-72 border-l bg-gray-50 flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Document Info</h3>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {selectedDoc.versions && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Version History</h4>
                      {selectedDoc.versions.map(v => (
                        <div key={v.id} className="p-2 bg-white border rounded-lg mb-2">
                          <div className="text-xs font-medium">v{v.version}</div>
                          <div className="text-xs text-gray-500">{v.changes}</div>
                          <div className="text-xs text-gray-400">{v.uploadedAt}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" onClick={() => setShowViewer(false)}>Close</Button>
              {selectedDoc.status !== 'completed' && selectedDoc.status !== 'draft' && (
                <Button onClick={() => handleSignDocument(selectedDoc.id)}>
                  Sign Document
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Signature</h2>
              <button onClick={() => setShowSignatureModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button
                variant={signatureMode === 'type' ? 'primary' : 'outline'}
                className="flex-1"
                onClick={() => setSignatureMode('type')}
                leftIcon={<Type size={16} />}
              >
                Type
              </Button>
              <Button
                variant={signatureMode === 'draw' ? 'primary' : 'outline'}
                className="flex-1"
                onClick={() => setSignatureMode('draw')}
                leftIcon={<PenTool size={16} />}
              >
                Draw
              </Button>
            </div>
            
            {signatureMode === 'type' ? (
              <div className="space-y-4">
                <Input
                  label="Type your signature"
                  value={newSignature}
                  onChange={(e) => setNewSignature(e.target.value)}
                  placeholder="Type your name"
                />
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-2xl font-serif italic">{newSignature || 'Your signature'}</p>
                </div>
                <Button className="w-full" onClick={handleSaveSignature}>Save Signature</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={100}
                    className="w-full bg-white cursor-crosshair"
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseMove={(e) => {
                      if (isDrawing && canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        const rect = canvasRef.current.getBoundingClientRect();
                        ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx?.stroke();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    const ctx = canvasRef.current?.getContext('2d');
                    ctx?.clearRect(0, 0, 300, 100);
                  }}>Clear</Button>
                  <Button className="flex-1" onClick={handleSaveSignature}>Save</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};