"use client";

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export default function RecentNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?category=general');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent News</h2>
        </div>
        <a 
          href="/news" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 animate-pulse">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 h-3 w-12 rounded"></div>
                    <div className="bg-gray-200 h-3 w-16 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          news.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {item.category}
                </span>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                      <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.headline}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.summary}
              </p>
            </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}