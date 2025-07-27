"use client";

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Users, MessageSquare, TrendingUp, ExternalLink, ThumbsUp, Plus, X, Upload, Send } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

interface TradeIdea {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
  likes?: number;
  comments?: number;
  tag?: string;
}

export default function CommunityPage() {
  const [ideas, setIdeas] = useState<TradeIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', image: null as File | null });
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trade-ideas');
      const data = await res.json();
      setIdeas(data);
    } catch {
      setError('Failed to load trade ideas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.image) formData.append('image', form.image);
    try {
      const res = await fetch('/api/trade-ideas', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit idea');
      }
      setForm({ title: '', description: '', image: null });
      setPreview(null);
      setSuccess('Trade idea submitted successfully!');
      setShowForm(false);
      fetchIdeas();
    } catch (err: any) {
      setError(err.message || 'Failed to submit idea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Trading Community</h1>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Share Idea</span>
                </button>
              </div>
              <p className="text-gray-600">Connect with traders, share insights, and discover new strategies</p>
            </div>

          
          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Share Your Trade Idea</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your trade idea title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your trade idea, analysis, or strategy..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{form.image ? 'Change Image' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </label>
                    {form.image && (
                      <span className="text-sm text-gray-600">{form.image.name}</span>
                    )}
                  </div>
                </div>
                
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="Preview" className="max-w-full max-h-48 rounded-lg object-cover" />
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Publishing...' : 'Publish Idea'}</span>
                  </button>
                  
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  
                  {success && (
                    <div className="text-green-600 text-sm">{success}</div>
                  )}
                </div>
              </form>
            </div>
          )}

          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Trade Ideas</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trade ideas yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/community/${idea.id}`}
                    className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer group"
                  >
                    <div className="space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {(idea.author || 'User').charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{idea.author || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">{new Date(idea.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                      </div>

                      
                      {idea.imageUrl && (
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img 
                            src={idea.imageUrl}
                            alt={idea.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {idea.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {idea.description}
                        </p>
                      </div>

                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{idea.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm">{idea.comments || 0}</span>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>


        </div>
      </main>
    </div>
    </AuthGuard>
  );
} 