"use client";

import { Users, MessageSquare, TrendingUp, ThumbsUp } from 'lucide-react';

const communityPosts = [
  {
    author: "TradingPro_Mike",
    title: "AAPL Bullish Pattern - Cup & Handle Formation",
    content: "Spotted a classic cup and handle pattern on AAPL daily chart. Target price around $185...",
    likes: 24,
    comments: 8,
    time: "3 hours ago",
    tag: "Technical Analysis"
  },
  {
    author: "MarketWatcher",
    title: "Energy Sector Rotation Strategy",
    content: "With oil prices rising, consider rotating into XLE. Here's my analysis on top energy picks...",
    likes: 18,
    comments: 12,
    time: "5 hours ago",
    tag: "Strategy"
  },
  {
    author: "DividendHunter",
    title: "Top 5 Dividend Stocks for 2024",
    content: "My picks for reliable dividend growth stocks that can weather market volatility...",
    likes: 31,
    comments: 15,
    time: "8 hours ago",
    tag: "Dividend Investing"
  }
];

export default function CommunityHighlights() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Community Insights</h2>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityPosts.map((post, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>
                  </div>
          
                </div>

                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.content}
                  </p>
                </div>


                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}