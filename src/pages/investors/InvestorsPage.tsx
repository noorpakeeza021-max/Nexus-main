import React, { useState } from 'react';
import { Search, Filter, MapPin, X, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { investors } from '../../data/users';
import { Button } from '../../components/ui/Button';

export const InvestorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const allStages = Array.from(new Set(investors.flatMap(i => i.investmentStage)));
  const allInterests = Array.from(new Set(investors.flatMap(i => i.investmentInterests)));
  
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchQuery === '' || 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStages = selectedStages.length === 0 || investor.investmentStage.some(stage => selectedStages.includes(stage));
    const matchesInterests = selectedInterests.length === 0 || investor.investmentInterests.some(interest => selectedInterests.includes(interest));
    return matchesSearch && matchesStages && matchesInterests;
  });
  
  const toggleStage = (stage: string) => {
    setSelectedStages(prev => prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]);
  };
  
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };
  
  const clearFilters = () => {
    setSelectedStages([]);
    setSelectedInterests([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Find Investors</h1>
          <p className="text-sm sm:text-base text-gray-600">Connect with investors</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" /> Filters
          {(selectedStages.length > 0 || selectedInterests.length > 0) && (
            <span className="ml-2 bg-primary-600 text-white px-1.5 rounded-full text-xs">
              {selectedStages.length + selectedInterests.length}
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Filters - Desktop Always Visible */}
        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-base lg:text-lg font-medium text-gray-900">Filters</h2>
              {(selectedStages.length > 0 || selectedInterests.length > 0) && (
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700">
                  Clear all
                </button>
              )}
            </CardHeader>
            <CardBody className="space-y-4 lg:space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Stage</h3>
                <div className="space-y-1 lg:space-y-2">
                  {allStages.map(stage => (
                    <button
                      key={stage}
                      onClick={() => toggleStage(stage)}
                      className={`block w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-sm ${
                        selectedStages.includes(stage) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Interests</h3>
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {allInterests.map(interest => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'primary' : 'gray'}
                      className="cursor-pointer text-xs lg:text-sm"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
            <div className="w-full">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <span className="text-xs lg:text-sm text-gray-600 whitespace-nowrap">
              {filteredInvestors.length} results
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {filteredInvestors.map(investor => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
          
          {filteredInvestors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No investors found matching your criteria</p>
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