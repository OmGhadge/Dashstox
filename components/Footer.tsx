"use client";

import { TrendingUp, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">Dashstox</span>
          </Link>
          
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        
        <div className="border-t border-gray-800 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-400">
              <span>© 2024 Dashstox. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}