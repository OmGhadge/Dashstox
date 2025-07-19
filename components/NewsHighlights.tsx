"use client";

import { Newspaper, ExternalLink, Clock } from 'lucide-react';

const newsItems = [
  {
    title: "Fed Signals Potential Rate Cut as Inflation Cools",
    summary: "Federal Reserve hints at monetary policy shift amid declining inflation rates...",
    time: "2 hours ago",
    category: "Federal Reserve"
  },
  {
    title: "Tech Stocks Rally on Strong Earnings Reports",
    summary: "Major technology companies exceed Q4 expectations, driving market optimism...",
    time: "4 hours ago",
    category: "Earnings"
  },
  {
    title: "Oil Prices Surge Following OPEC+ Production Cuts",
    summary: "Energy sector sees significant gains as supply constraints impact global markets...",
    time: "6 hours ago",
    category: "Commodities"
  }
];

export default function NewsHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Newspaper className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Latest Market News</h2>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.summary}
                </p>
                

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}