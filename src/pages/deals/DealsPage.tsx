import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar, Plus, X, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const deals = [
  { id: 1, startup: { name: 'TechWave AI', logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', industry: 'FinTech' }, amount: '$1.5M', equity: '15%', status: 'Due Diligence', stage: 'Series A', lastActivity: '2024-02-15' },
  { id: 2, startup: { name: 'GreenLife Solutions', logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', industry: 'CleanTech' }, amount: '$2M', equity: '20%', status: 'Term Sheet', stage: 'Seed', lastActivity: '2024-02-10' },
  { id: 3, startup: { name: 'HealthPulse', logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', industry: 'HealthTech' }, amount: '$800K', equity: '12%', status: 'Negotiation', stage: 'Pre-seed', lastActivity: '2024-02-05' }
];

const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];

export const DealsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Due Diligence': return 'primary';
      case 'Term Sheet': return 'secondary';
      case 'Negotiation': return 'accent';
      case 'Closed': return 'success';
      case 'Passed': return 'error';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your pipeline</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-1" /> Add Deal
        </Button>
      </div>
      
      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="col-span-2 lg:col-span-1">
          <CardBody className="py-3 lg:py-4">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 bg-primary-100 rounded-lg mr-2 lg:mr-3">
                <DollarSign size={16} lg:size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Total</p>
                <p className="text-base lg:text-lg font-semibold text-gray-900">$4.3M</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="col-span-2 lg:col-span-1">
          <CardBody className="py-3 lg:py-4">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 bg-secondary-100 rounded-lg mr-2 lg:mr-3">
                <TrendingUp size={16} lg:size={20} className="text-secondary-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Active</p>
                <p className="text-base lg:text-lg font-semibold text-gray-900">8</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="col-span-2 lg:col-span-1">
          <CardBody className="py-3 lg:py-4">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 bg-accent-100 rounded-lg mr-2 lg:mr-3">
                <Users size={16} lg:size={20} className="text-accent-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Portfolio</p>
                <p className="text-base lg:text-lg font-semibold text-gray-900">12</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="col-span-2 lg:col-span-1">
          <CardBody className="py-3 lg:py-4">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 bg-green-100 rounded-lg mr-2 lg:mr-3">
                <Calendar size={16} lg:size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Closed</p>
                <p className="text-base lg:text-lg font-semibold text-gray-900">2</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {statuses.map(status => (
            <Badge
              key={status}
              variant={selectedStatus.includes(status) ? getStatusColor(status) : 'gray'}
              className="cursor-pointer text-xs lg:text-sm"
              onClick={() => toggleStatus(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Deals List - Responsive: Cards on Mobile, Table on Desktop */}
      <Card>
        <CardHeader>
          <h2 className="text-base lg:text-lg font-medium text-gray-900">Active Deals</h2>
        </CardHeader>
        <CardBody className="p-0">
          {/* Mobile: Card View */}
          <div className="lg:hidden space-y-3 p-3">
            {deals.map(deal => (
              <div key={deal.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <Avatar src={deal.startup.logo} alt={deal.startup.name} size="md" className="flex-shrink-0" />
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deal.startup.name}</p>
                      <p className="text-xs text-gray-500">{deal.startup.industry}</p>
                    </div>
                    <Badge variant={getStatusColor(deal.status)} className="text-xs">{deal.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-3 text-xs text-gray-600">
                      <span>{deal.amount}</span>
                      <span>{deal.equity}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop: Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Startup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{deal.startup.name}</div>
                          <div className="text-sm text-gray-500">{deal.startup.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.equity}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.stage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deal.lastActivity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Deal</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter startup name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="$100,000" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button className="flex-1">Add Deal</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};