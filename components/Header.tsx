"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, TrendingUp } from 'lucide-react';
import AuthButtons from '@/components/AuthButtons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Dashstox</span>
          </Link>

          
          <nav className="hidden md:flex space-x-8">
            {pathname === '/' ? (
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
            ) : (
              <Link href="/#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
            )}
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/about#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          
          
          <div className="hidden md:flex space-x-4">
          <AuthButtons/>

          </div>

          
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {pathname === '/' ? (
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
              ) : (
                <Link href="/#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
              )}
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/about#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Log In
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}