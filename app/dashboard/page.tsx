"use client";

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MarketOverview from '@/components/dashboard/MarketOverview';
import Watchlist from '@/components/dashboard/Watchlist';
import RecentNews from '@/components/dashboard/RecentNews';
import CommunityFeed from '@/components/dashboard/CommunityFeed';
import AuthGuard from '@/components/AuthGuard';

export default function Dashboard() {
  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back!
          </h1>
          <p className="text-gray-600">
            Here's what's happening in the markets today
          </p>
        </div>

     
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <MarketOverview />
            <RecentNews />
          </div>

        
          <div className="space-y-8">
          
            <Watchlist />
            <CommunityFeed />
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}