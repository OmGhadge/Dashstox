"use client";

import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {  Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthGuard from '@/components/AuthGuard';

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

const NEWS_URL = '/api/news?category=general';


const NewsCard = ({ item }: { item: NewsItem }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300 cursor-pointer group">
      <CardContent className="p-6">
        {item.image && (
          <div className="mb-4">
            <img 
              src={item.image} 
              alt={item.headline} 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.headline}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {item.summary}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">Source: {item.source}</span>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <span>Read more</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(NEWS_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data.slice(0, 12)); 
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial News</h1>
            <p className="text-gray-600">Stay updated with the latest market news and financial insights</p>
          </div>


       
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="bg-gray-200 h-48 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                        <div className="bg-gray-200 h-6 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">Error: {error}</div>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No news found matching your criteria</div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <NewsCard item={item} />
                </a>
              ))}
            </div>
          )}

     
          {!loading && !error && filteredNews.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More News
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
} 