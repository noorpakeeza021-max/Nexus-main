import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';
import { Button } from '../../components/ui/Button';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const allIndustries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];
  
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(entrepreneur.industry);
    const matchesFunding = selectedFundingRange.length === 0 || selectedFundingRange.some(range => {
      const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ''));
      switch (range) {
        case '< $500K': return amount < 500;
        case '$500K - $1M': return amount >= 500 && amount <= 1000;
        case '$1M - $5M': return amount > 1000 && amount <= 5000;
        case '> $5M': return amount > 5000;
        default: return true;
      }
    });
    return matchesSearch && matchesIndustry && matchesFunding;
  });
  
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]);
  };
  
  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange(prev => prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]);
  };
  
  const clearFilters = () => {
    setSelectedIndustries([]);
    setSelectedFundingRange([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Find Startups</h1>
          <p className="text-sm sm:text-base text-gray-600">Discover promising startups</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" /> Filters
          {(selectedIndustries.length > 0 || selectedFundingRange.length > 0) && (
            <span className="ml-2 bg-primary-600 text-white px-1.5 rounded-full text-xs">
              {selectedIndustries.length + selectedFundingRange.length}
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Filters */}
        <div className={`space-y-4 lg:space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-base lg:text-lg font-medium text-gray-900">Filters</h2>
              {(selectedIndustries.length > 0 || selectedFundingRange.length > 0) && (
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700">
                  Clear
                </button>
              )}
            </CardHeader>
            <CardBody className="space-y-4 lg:space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Industry</h3>
                <div className="space-y-1 lg:space-y-2 max-h-40 lg:max-h-48 overflow-y-auto">
                  {allIndustries.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`block w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-sm ${
                        selectedIndustries.includes(industry) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Funding Range</h3>
                <div className="space-y-1">
                  {fundingRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-sm ${
                        selectedFundingRange.includes(range) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                <div className="space-y-1">
                  {['San Francisco, CA', 'New York, NY', 'Boston, MA'].map(loc => (
                    <button key={loc} className="flex items-center w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm text-gray-700 hover:bg-gray-50">
                      <MapPin size={12} lg:size={16} className="mr-1.5 lg:mr-2" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <span className="text-xs lg:text-sm text-gray-600 whitespace-nowrap">
              {filteredEntrepreneurs.length} results
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {filteredEntrepreneurs.map(entrepreneur => (
              <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
            ))}
          </div>
          
          {filteredEntrepreneurs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No startups found</p>
              <button onClick={clearFilters} className="mt-4 text-primary-600 hover:text-primary-700">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};