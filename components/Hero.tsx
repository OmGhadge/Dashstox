"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function Hero() {
  
  const nasdaqData = { price: 13456.78, change: '+1.87%', isUp: true };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Your Complete Trading
                <span className="text-blue-600"> Platform</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Real-time charts, latest financial news, community insights, and essential stock data — all in one powerful platform.
              </p>
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">NASDAQ</p>
                  <p className={`text-2xl font-bold ${nasdaqData.isUp ? 'text-green-600' : 'text-red-600'}`}>{nasdaqData.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`h-5 w-5 ${nasdaqData.isUp ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${nasdaqData.isUp ? 'text-green-600' : 'text-red-600'}`}>{nasdaqData.change}</span>
                </div>
              </div>
            </div>

            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

          </div>

          
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">NASDAQ - 1D</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Candlestick</span>
                  </div>
                </div>
              </div>

              
              <div className="p-6 h-80 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Interactive Charts</p>
                    <p className="text-sm text-gray-600">Switch between major indices</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}