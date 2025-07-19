"use client";

import { BarChart3, Newspaper, Users, Plus, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  {
    title: 'Open Charts',
    description: 'Analyze stocks with advanced charting tools',
    icon: BarChart3,
    href: '/charts',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Latest News',
    description: 'Stay updated with market news and analysis',
    icon: Newspaper,
    href: '/news',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Community',
    description: 'Share ideas and learn from other traders',
    icon: Users,
    href: '/community',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Add to Watchlist',
    description: 'Track your favorite stocks and indices',
    icon: Plus,
    href: '#',
    color: 'bg-purple-100 text-purple-600'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Search */}
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for stocks, ETFs, or indices..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div> */}
    </div>
  );
}