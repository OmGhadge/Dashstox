"use client";

import { Users, TrendingUp, BarChart3} from 'lucide-react';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <>
      <Header />
      <section className="py-32 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div id="about" className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              About Dashstox
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dashstox is dedicated to empowering traders and investors with modern tools, real-time data, and a vibrant community. Our mission is to make trading accessible, insightful, and collaborative for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 flex flex-col items-center text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600">To be the most trusted and innovative platform for traders worldwide.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200 flex flex-col items-center text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Platform</h3>
              <p className="text-gray-600">We provide real-time charts, news, and community features to help you make informed decisions.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Community</h3>
              <p className="text-gray-600">Join thousands of traders sharing ideas, strategies, and market insights every day.</p>
            </div>
          </div>
          
          <div id="contact" className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              For any questions or feedback, please email us at <span className='text-blue-600'>support@dashstox.com</span>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 