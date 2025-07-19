"use client";

import { useState, useEffect } from 'react';
import { Users, MessageSquare, ThumbsUp, TrendingUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TradeIdea {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  author?: string;
  authorImage?: string;
}

export default function CommunityFeed() {
  const [ideas, setIdeas] = useState<TradeIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/trade-ideas');
        if (!response.ok) {
          throw new Error('Failed to fetch trade ideas');
        }
        const data = await response.json();
        setIdeas(data.slice(0, 3)); // Show only 3 ideas
      } catch (error) {
        console.error('Error fetching trade ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Community</h3>
        </div>
        <a 
          href="/community" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-3 rounded-lg border border-gray-200 animate-pulse">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="bg-gray-200 h-4 w-20 rounded"></div>
                  </div>
                  <div className="bg-gray-200 h-3 w-12 rounded"></div>
                </div>
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            </div>
          ))
        ) : ideas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No trade ideas yet</p>
        ) : (
          ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/community/${idea.id}`}
              className="block p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {idea.authorImage ? (
                      <img
                        src={idea.authorImage}
                        alt={idea.author || 'User'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {(idea.author || 'User').charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{idea.author || 'User'}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{idea.title}</h4>
                  </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{idea.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3" />
                      <span>{idea.likes ?? 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                      <span>{idea.comments ?? 0}</span>
                    </div>
                  </div>
                </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500 mb-2">Join the conversation</p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Share Your Ideas
        </button>
      </div>
    </div>
  );
}