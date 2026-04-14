import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const messages = [];

const router = express.Router();

router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
    res.json(userMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const message = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    messages.push(message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/read', (req, res) => {
  try {
    const msg = messages.find(m => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    msg.read = true;
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;