"use client";

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const portfolioData = {
  totalValue: 125430.50,
  dayChange: 2340.75,
  dayChangePercent: 1.9,
  totalGain: 15430.50,
  totalGainPercent: 14.0,
  isUp: true
};

export default function PortfolioSummary() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
        <a href="/portfolio" className="text-sm text-blue-600 hover:text-blue-700">
          View Details
        </a>
      </div>

      <div className="space-y-4">
        
        <div>
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${portfolioData.totalValue.toLocaleString()}
          </p>
        </div>

        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today's Change</p>
            <div className="flex items-center space-x-1">
              {portfolioData.isUp ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className={`font-semibold ${portfolioData.isUp ? 'text-green-600' : 'text-red-600'}`}>
                ${portfolioData.dayChange.toLocaleString()} ({portfolioData.dayChangePercent}%)
              </p>
            </div>
          </div>
        </div>

        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Total Gain/Loss</p>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-green-600">
              ${portfolioData.totalGain.toLocaleString()} ({portfolioData.totalGainPercent}%)
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">Holdings</p>
            <p className="text-lg font-semibold text-gray-900">12</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Cash</p>
            <p className="text-lg font-semibold text-gray-900">$5.2K</p>
          </div>
        </div>
      </div>
    </div>
  );
}