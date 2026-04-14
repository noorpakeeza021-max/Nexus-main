import { v4 as uuidv4 } from 'uuid';

export const documents = new Map();
export const signatures = new Map();

export const createDocument = (docData) => {
  const document = {
    id: uuidv4(),
    ...docData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  documents.set(document.id, document);
  return document;
};

export const findDocumentById = (id) => documents.get(id);

export const findDocumentsByUser = (userId) => {
  return Array.from(documents.values()).filter(d => d.ownerId === userId);
};

export const updateDocument = (id, updates) => {
  const document = documents.get(id);
  if (!document) return null;
  const updatedDocument = { ...document, ...updates, updatedAt: new Date().toISOString() };
  documents.set(id, updatedDocument);
  return updatedDocument;
};

export const deleteDocument = (id) => documents.delete(id);

export const createSignature = (sigData) => {
  const signature = { id: uuidv4(), ...sigData, createdAt: new Date().toISOString() };
  signatures.set(signature.id, signature);
  return signature;
};

export const getSignaturesByUser = (userId) => {
  return Array.from(signatures.values()).filter(s => s.userId === userId);
};

export const seedDocuments = () => {
  const defaultDocs = [
    { name: 'Investment Agreement.pdf', type: 'PDF', size: '2.4 MB', ownerId: '1', status: 'pending_signature', shared: true },
    { name: 'NDA - Tech Corp.pdf', type: 'PDF', size: '1.2 MB', ownerId: '1', status: 'signed', shared: true },
  ];
  defaultDocs.forEach(createDocument);
};