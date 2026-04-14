import React, { useState } from 'react';
import { CreditCard, Wallet, DollarSign, TrendingUp, TrendingDown, Plus, X, Check, AlertCircle, Calendar, Receipt, ArrowUpRight, ArrowDownRight, Building, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  last4: string;
  expiry?: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

const transactions: Transaction[] = [
  { id: '1', type: 'debit', amount: 5000, description: 'Premium Plan Subscription', date: '2024-02-15', status: 'completed', category: 'Subscription' },
  { id: '2', type: 'credit', amount: 2500, description: 'Payment Received - Tech Startup', date: '2024-02-14', status: 'completed', category: 'Income' },
  { id: '3', type: 'debit', amount: 999, description: 'Video Call Package', date: '2024-02-12', status: 'completed', category: 'Service' },
  { id: '4', type: 'credit', amount: 10000, description: 'Investment - Seed Round', date: '2024-02-10', status: 'completed', category: 'Income' },
  { id: '5', type: 'debit', amount: 150, description: 'Document E-Signature', date: '2024-02-08', status: 'completed', category: 'Service' },
];

const paymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', name: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: '2', type: 'bank', name: 'Chase Bank', last4: '1234', isDefault: false },
];

const invoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-001', amount: 499, description: 'Basic Plan - February 2024', dueDate: '2024-02-28', status: 'pending' },
  { id: '2', invoiceNumber: 'INV-002', amount: 999, description: 'Pro Plan - February 2024', dueDate: '2024-02-15', status: 'paid', paidDate: '2024-02-14' },
  { id: '3', invoiceNumber: 'INV-003', amount: 2499, description: 'Enterprise Plan - January 2024', dueDate: '2024-01-31', status: 'paid', paidDate: '2024-01-30' },
];

export const PaymentPage: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleAddCard = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowAddCard(false);
        setPaymentSuccess(false);
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setCardName('');
      }, 2000);
    }, 2000);
  };

  const totalIncome = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'overdue':
        return <Badge variant="error">Overdue</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage your payments and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Balance</p>
                <h3 className="text-2xl font-bold text-green-900">${balance.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <Wallet size={24} className="text-green-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Income</p>
                <h3 className="text-2xl font-bold text-blue-900">${totalIncome.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <TrendingUp size={24} className="text-blue-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Expenses</p>
                <h3 className="text-2xl font-bold text-red-900">${totalExpense.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <TrendingDown size={24} className="text-red-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Pending Invoices</p>
                <h3 className="text-2xl font-bold text-purple-900">
                  ${invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Receipt size={24} className="text-purple-700" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
                    <div className={`p-3 rounded-full mr-4 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownRight size={20} className="text-green-600" />
                      ) : (
                        <ArrowUpRight size={20} className="text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="p-3 bg-gray-100 rounded-lg mr-4">
                      <Receipt size={20} className="text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</h4>
                      <p className="text-xs text-gray-500">{invoice.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Due: {invoice.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">${invoice.amount.toLocaleString()}</div>
                      {getInvoiceStatusBadge(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className={`p-4 border-2 rounded-lg ${method.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {method.type === 'card' ? <CreditCard size={20} /> : <Building size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{method.name}</h4>
                        <p className="text-xs text-gray-500">
                          {method.type === 'card' ? `•••• ${method.last4}` : `Account •••• ${method.last4}`}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && <Badge variant="primary">Default</Badge>}
                  </div>
                  {method.type === 'card' && method.expiry && (
                    <p className="text-xs text-gray-500 mt-2">Expires {method.expiry}</p>
                  )}
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setShowAddCard(true)} leftIcon={<Plus size={16} />}>
                  Add Card
                </Button>
                <Button variant="outline" onClick={() => setShowAddBank(true)} leftIcon={<Plus size={16} />}>
                  Add Bank
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Security</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Secure Payments</p>
                  <p className="text-xs text-green-600">256-bit SSL encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Lock size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">PCI Compliant</p>
                  <p className="text-xs text-blue-600">Your data is protected</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Card</h2>
              <button onClick={() => setShowAddCard(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Card Added Successfully!</h3>
                <p className="text-gray-600 mt-2">Your new card has been saved.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type={showCardNumber ? 'text' : 'password'}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-lg pr-12"
                      maxLength={19}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCardNumber(!showCardNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      maxLength={4}
                    />
                  </div>
                </div>

                <Input
                  label="Name on Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Smith"
                />

                <Button className="w-full" onClick={handleAddCard} disabled={processingPayment}>
                  {processingPayment ? 'Processing...' : 'Add Card'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock size={12} />
                  Your card information is secure
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Link Bank Account</h2>
              <button onClick={() => setShowAddBank(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Bank Name" placeholder="Enter bank name" />
              <Input label="Account Number" placeholder="Enter account number" />
              <Input label="Routing Number" placeholder="Enter routing number" />
              <Input label="Account Holder Name" placeholder="Enter account holder name" />

              <Button className="w-full" onClick={() => setShowAddBank(false)}>Link Account</Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={12} />
                Your bank information is encrypted and secure
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};