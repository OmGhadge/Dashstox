"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  
  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      }
    }
  }, []);

    
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (!watchlist.includes(upperSymbol)) {
      setWatchlist(prev => [...prev, upperSymbol]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    setWatchlist(prev => prev.filter(s => s !== upperSymbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol.toUpperCase());
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
} 