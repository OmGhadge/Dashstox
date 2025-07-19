"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Users, 
  Menu,
  X
} from 'lucide-react';
import { useSession, signOut, signIn } from 'next-auth/react';
import * as Avatar from '@radix-ui/react-avatar';
import Link from 'next/link';

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-user-menu]')) {
          setUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
    { name: 'Charts', href: '/charts', icon: BarChart3 },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Community', href: '/community', icon: Users },
  ];

  // Determine active page based on current pathname
  const [activePage, setActivePage] = useState('Dashboard');
  
  useEffect(() => {
    const pathname = window.location.pathname;
    const currentPage = navigationItems.find(item => item.href === pathname);
    if (currentPage) {
      setActivePage(currentPage.name);
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Dashstox</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === item.name
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative" data-user-menu>
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                    <Avatar.Image
                      src={session.user?.image ?? ""}
                      alt={session.user?.name ?? "User"}
                      className="w-full h-full object-cover"
                    />
                    <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                      {session.user?.name?.[0] ?? "U"}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {session.user?.name ?? session.user?.email}
              </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      {session.user?.name ?? session.user?.email}
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => { setUserMenuOpen(false); signOut(); }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
              >
                Sign in
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === item.name
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
            

          </div>
        )}
      </div>
    </header>
  );
}