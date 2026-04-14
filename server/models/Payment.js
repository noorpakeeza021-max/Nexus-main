import { v4 as uuidv4 } from 'uuid';

export const transactions = new Map();
export const paymentMethods = new Map();
export const invoices = new Map();

export const createTransaction = (txData) => {
  const transaction = { id: uuidv4(), ...txData, createdAt: new Date().toISOString() };
  transactions.set(transaction.id, transaction);
  return transaction;
};

export const findTransactionsByUser = (userId) => {
  return Array.from(transactions.values())
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createPaymentMethod = (pmData) => {
  const method = { id: uuidv4(), ...pmData, createdAt: new Date().toISOString() };
  paymentMethods.set(method.id, method);
  return method;
};

export const findPaymentMethodsByUser = (userId) => {
  return Array.from(paymentMethods.values()).filter(pm => pm.userId === userId);
};

export const deletePaymentMethod = (id) => paymentMethods.delete(id);

export const createInvoice = (invData) => {
  const invoice = { id: uuidv4(), ...invData, createdAt: new Date().toISOString() };
  invoices.set(invoice.id, invoice);
  return invoice;
};

export const findInvoicesByUser = (userId) => {
  return Array.from(invoices.values())
    .filter(i => i.userId === userId)
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
};

export const seedPayments = () => {
  const defaultTx = [
    { type: 'debit', amount: 5000, description: 'Premium Plan', userId: '1', status: 'completed', category: 'Subscription' },
    { type: 'credit', amount: 2500, description: 'Payment Received', userId: '1', status: 'completed', category: 'Income' },
  ];
  defaultTx.forEach(createTransaction);

  const defaultMethods = [
    { type: 'card', name: 'Visa', last4: '4242', userId: '1', isDefault: true },
  ];
  defaultMethods.forEach(createPaymentMethod);
};