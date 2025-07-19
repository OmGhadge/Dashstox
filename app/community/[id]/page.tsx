"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AuthGuard from '@/components/AuthGuard';
import { Users, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Comment {
  id: number;
  content: string;
  author?: string;
  authorImage?: string;
  createdAt: string;
}

interface TradeIdea {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
  authorImage?: string;
  likes?: number;
  comments?: Comment[];
  tag?: string;
  likesList?: any[];
}

export default function TradeIdeaDetail() {
  const { id } = useParams(); 
  const { data: session } = useSession();
  const [idea, setIdea] = useState<TradeIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const router = useRouter();
  const [userHasLiked, setUserHasLiked] = useState(false);

  const fetchIdea = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trade-ideas/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      console.log('Fetched trade idea:', data); // <-- log full idea
      if (data.comments) {
        console.log('Type of comments:', typeof data.comments, Array.isArray(data.comments));
        console.log('Comments value:', data.comments);
      }
      setIdea(data);
      // Check if user has liked
      if (session?.user?.email && data.likesList) {
        setUserHasLiked(data.likesList.some((like: any) => like.userId === session.user?.email));
      } else {
        setUserHasLiked(false);
      }
    } catch {
      setError('Trade idea not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(id)fetchIdea();
    // eslint-disable-next-line
  }, [id]);

  const handleLike = async () => {
    if (!idea || userHasLiked) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/trade-ideas?id=${idea.id}&action=like`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to like');
      setIdea(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
      setUserHasLiked(true);
    } catch {}
    setLikeLoading(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    try {
      const res = await fetch(`/api/trade-ideas/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add comment');
      }
      const newComment = await res.json();
      setComment('');
      setIdea(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev);
    } catch (err: any) {
      setCommentError(err.message || 'Failed to add comment');
    }
    setCommentLoading(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="pt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              className="mb-6 text-blue-600 hover:underline text-sm"
              onClick={() => router.back()}
            >
              &larr; Back to Community
            </button>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-12">{error}</div>
            ) : idea ? (
              <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  {idea.authorImage ? (
                    <img src={idea.authorImage} alt={idea.author || 'User'} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {(idea.author || 'User').charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-base font-medium text-gray-900">{idea.author || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{new Date(idea.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {idea.tag || 'Trade Idea'}
                  </span>
                </div>
                {idea.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-6">
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{idea.title}</h1>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{idea.description}</p>
                <div className="flex items-center space-x-6 border-t border-gray-100 pt-4 mb-6">
                  <button
                    className={`flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors ${likeLoading || userHasLiked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleLike}
                    disabled={likeLoading || userHasLiked}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-base">{idea.likes || 0}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-base">{idea.comments?.length || 0}</span>
                  </div>
                  
                </div>
                {/* Comments Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Comments</h2>
                  {idea.comments && idea.comments.length > 0 ? (
                    <div className="space-y-4">
                      {(() => { console.log('Rendering comments:', idea.comments); return null; })()}
                      {idea.comments.map((c) => (
                        <div key={c.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center space-x-2 mb-1">
                            {c.authorImage ? (
                              <img src={c.authorImage} alt={c.author || 'U'} className="w-7 h-7 rounded-full object-cover" />
                            ) : (
                              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {(c.author || 'U').charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-xs font-medium text-gray-900">{c.author || 'Anonymous'}</span>
                            <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-line">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
                {/* Add Comment Form */}
                <form onSubmit={handleComment} className="flex flex-col space-y-3">
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a comment..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !comment.trim()}
                    className="self-end px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                  {commentError && <div className="text-red-600 text-sm">{commentError}</div>}
                </form>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 