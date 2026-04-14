import express from 'express';
import { createTransaction, findTransactionsByUser, createPaymentMethod, findPaymentMethodsByUser, deletePaymentMethod, createInvoice, findInvoicesByUser } from '../models/Payment.js';

const router = express.Router();

router.get('/transactions', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const txs = findTransactionsByUser(userId);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions', (req, res) => {
  try {
    const tx = createTransaction(req.body);
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/methods', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const methods = findPaymentMethodsByUser(userId);
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/methods', (req, res) => {
  try {
    const method = createPaymentMethod(req.body);
    res.status(201).json(method);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/methods/:id', (req, res) => {
  try {
    const deleted = deletePaymentMethod(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Method not found' });
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/invoices', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const invoices = findInvoicesByUser(userId);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/invoices', (req, res) => {
  try {
    const invoice = createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;