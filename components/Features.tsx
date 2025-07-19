"use client";

import { BarChart3, Newspaper, Eye, Database, Users, TrendingUp } from 'lucide-react';
import { signIn } from 'next-auth/react';

const features = [
  {
    icon: BarChart3,
    title: 'Interactive Charts',
    description: 'Real-time trading charts with technical indicators and customizable layouts for major stocks and indices.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Newspaper,
    title: 'Financial News',
    description: 'Stay updated with the latest market news, earnings reports, and financial insights from trusted sources.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Eye,
    title: 'Watchlists',
    description: 'Create and manage watchlist to track your favorite stocks, indices, and market movements.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Database,
    title: 'Stock Data',
    description: 'Essential stock information including price history and volume.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Users,
    title: 'Trading Community',
    description: 'Connect with traders, share ideas and strategies, discuss market trends, and learn from experienced investors.',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: TrendingUp,
    title: 'Popular Technical Indicators',
    description: 'Access popular technical indicators to enhance your trading analysis and strategies.',
    color: 'bg-yellow-100 text-yellow-600'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Complete Trading Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From real-time charts to community insights - everything you need 
            to make informed trading decisions in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-24">
          <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-gray-600 mb-6">
              Get access to real-time data, community insights, and powerful trading tools.
            </p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
            >
              Join Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}