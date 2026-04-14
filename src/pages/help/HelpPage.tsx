import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const faqs = [
  { question: 'How do I connect with investors?', answer: 'Browse our investor directory and send connection requests. Once accepted, you can message directly.' },
  { question: 'What should I include in my startup profile?', answer: 'Include a compelling pitch, funding needs, team info, market opportunity, and any traction or metrics.' },
  { question: 'How do I share documents securely?', answer: 'Upload to your secure vault and share selectively. All documents are encrypted and access-controlled.' },
  { question: 'What are collaboration requests?', answer: 'Formal expressions of interest from investors wanting to learn more about your startup.' }
];

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = searchQuery 
    ? faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm sm:text-base text-gray-600">Find answers or contact our team</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Quick links - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="sm:col-span-1">
          <CardBody className="text-center p-4 sm:p-6">
            <div className="inline-flex items-center justify-center w-10 sm:w-12 bg-primary-50 rounded-lg mb-3 sm:mb-4">
              <Book size={20} className="sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Documentation</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Browse guides and docs</p>
            <Button variant="outline" size="sm" className="mt-3 sm:mt-4">
              <ExternalLink size={14} className="mr-1" /> View
            </Button>
          </CardBody>
        </Card>
        
        <Card className="sm:col-span-1">
          <CardBody className="text-center p-4 sm:p-6">
            <div className="inline-flex items-center justify-center w-10 sm:w-12 bg-primary-50 rounded-lg mb-3 sm:mb-4">
              <MessageCircle size={20} className="sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Live Chat</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Chat with support</p>
            <Button size="sm" className="mt-3 sm:mt-4">Start Chat</Button>
          </CardBody>
        </Card>
        
        <Card className="sm:col-span-1">
          <CardBody className="text-center p-4 sm:p-6">
            <div className="inline-flex items-center justify-center w-10 sm:w-12 bg-primary-50 rounded-lg mb-3 sm:mb-4">
              <Phone size={20} className="sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Contact Us</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Email or phone</p>
            <Button variant="outline" size="sm" className="mt-3 sm:mt-4">
              <Mail size={14} className="mr-1" /> Contact
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* FAQs - Responsive Accordion */}
      <Card>
        <CardHeader>
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 sm:space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact form */}
      <Card>
        <CardHeader>
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Still need help?</h2>
        </CardHeader>
        <CardBody>
          <form className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input label="Name" placeholder="Your name" />
              <Input label="Email" type="email" placeholder="your@email.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
                placeholder="How can we help?"
              ></textarea>
            </div>
            
            <Button>Send Message</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};