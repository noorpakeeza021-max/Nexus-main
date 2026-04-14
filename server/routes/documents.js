import express from 'express';
import { createDocument, findDocumentById, findDocumentsByUser, updateDocument, deleteDocument, getSignaturesByUser, createSignature } from '../models/Document.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const docs = findDocumentsByUser(userId);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const doc = findDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const doc = createDocument(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const doc = updateDocument(req.params.id, req.body);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = deleteDocument(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/signatures/:userId', (req, res) => {
  try {
    const sigs = getSignaturesByUser(req.params.userId);
    res.json(sigs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signatures', (req, res) => {
  try {
    const sig = createSignature(req.body);
    res.status(201).json(sig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;